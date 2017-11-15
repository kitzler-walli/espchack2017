<#
.SYNOPSIS
Provisions a GDPR Activity Hub site

.EXAMPLE
PS C:\> .\Provision-GDPRActivityHub.ps1 -SiteName "GDPRActivityHub" -SiteDescription "My GDPR Activity Hub" -Credentials $credentials

.EXAMPLE
PS C:\> .\Provision-GDPRActivityHub.ps1 -SiteName "GDPRActivityHub" -SiteDescription "My GDPR Activity Hub" -ConfigureCDN -CDNSiteName "CDN" -Credentials $credentials

#>
[CmdletBinding()]
param
(
    [Parameter(Mandatory = $true, HelpMessage="The URL of the already created Modern Site")]
    [String]
    $GroupSiteUrl,

    [Parameter(ParameterSetName = "CDN", Mandatory = $false, HelpMessage="Declares whether to create and configure a CDN in the target Office 365 tenant")]
    [Switch]
    $ConfigureCDN=$false,

    [Parameter(ParameterSetName = "CDN", Mandatory = $false, HelpMessage="The name of the Team Site that will be created to support the CDN, e.g. ""CDN""")]
    [String]
    $CDNSiteName="CDN",

    [Parameter(ParameterSetName = "CDN", Mandatory = $false, HelpMessage="The name of the Docuemnt Library that will be created to support the CDN, e.g. ""CDNFiles""")]
    [String]
    $CDNLibraryName="CDNFiles",

	[Parameter(Mandatory = $false, HelpMessage="Optional tenant administration credentials")]
	[PSCredential]
	$Credentials,
	[string]$userName="",
	[string]$password=""
)

try
{
	if($Credentials -eq $null -and $userName -ne "" -and $password -ne "")
	{
		#$Credentials = Get-Credential -Message "Enter Tenant Admin Credentials"
		$Credentials = New-Object –TypeName "System.Management.Automation.PSCredential" –ArgumentList $userName, (ConvertTo-SecureString –String $password –AsPlainText -Force)
	}

	Connect-PnPOnline $GroupSiteUrl -Credentials $Credentials

    # **********************************************
    # Configure the Office 365 CDN, if requested
    # **********************************************

    $spoAdminCenterUrl = $GroupSiteUrl.replace(".sharepoint", "-admin.sharepoint")
    $spoAdminCenterUrl = $spoAdminCenterUrl.substring(0, $spoAdminCenterUrl.IndexOf("sharepoint.com/") + 15)

    $spoRootSiteUrl = $GroupSiteUrl.substring(0, $GroupSiteUrl.IndexOf("sharepoint.com/") + 15)
    $spoTenantName = $spoRootSiteUrl.Substring(8, $spoRootSiteUrl.LastIndexOf("/") - 8)
    $cdnSiteURL = $spoRootSiteUrl + "sites/" + $CDNSiteName

    if ($ConfigureCDN.IsPresent)
    {
        Write-Host "Configuring the Office 365 CDN Settings"
        $CDNDescription = "Content Delivery Network"

        # Create the CDN Site
        Connect-PnPOnline $spoAdminCenterUrl -Credentials $Credentials

        # Determine the current username
        $web = Get-PnPWeb
        $context = Get-PnPContext
        $user = $web.CurrentUser
        $context.Load($user)
        Execute-PnPQuery

        $currentUser = $user.Email

        # Create a new Site Collection
        Write-Host "Creating CDN Site Collection"
        New-PnPTenantSite -Title $CDNDescription -Url $cdnSiteURL -Description $CDNDescription -Owner $currentUser -Lcid 1033 -Template STS#0 -TimeZone 0 -RemoveDeletedSite -Wait

        # Create the CDN Files library in the CDN site
        Connect-PnPOnline $cdnSiteURL -Credentials $Credentials
        New-PnPList -Title $CDNLibraryName -Url $CDNLibraryName -Template DocumentLibrary

        # Create a folder in the CDNFiles document library
        Write-Host "Uploading SPFx assets to the CDN"
        $cdnFilesLibrary = Get-PnPList -Identity $CDNLibraryName
        $packageFolder = $cdnFilesLibrary.RootFolder.Folders.Add("bot")
        $context = Get-PnPContext
        $context.Load($packageFolder)
        Execute-PnPQuery

        # Configure the CDN at the tenant level
        Connect-SPOService -Url $spoAdminCenterUrl -Credential $Credentials
        Set-SPOTenantCdnEnabled -CdnType Public -Confirm:$false

        Add-SPOTenantCdnOrigin -CdnType Public -OriginUrl sites/$CDNSiteName/$CDNLibraryName -Confirm:$false
    }
	

    Connect-PnPOnline $cdnSiteURL -Credentials $Credentials

    # Build and package the solution
    Write-Host "Building SPFx package and bundling"
    Push-Location hackBot

    $cdnSiteAssetsFullUrl = "https://publiccdn.sharepointonline.com/" + $spoTenantName + "/sites/" + $CDNSiteName + "/" + $CDNLibraryName + "/bot"
    & gulp update-manifest --cdnpath "$cdnSiteAssetsFullUrl"
    & gulp clean
    & gulp bundle --ship
    & gulp package-solution --ship

    Pop-Location
    
    # Create a folder in the CDNFiles document library
    Write-Host "Uploading SPFx assets to the CDN"
    $cdnFilesLibrary = Get-PnPList -Identity $CDNLibraryName
    $packageFolder = $cdnFilesLibrary.RootFolder.Folders.Add("bot")
    $context = Get-PnPContext
    $context.Load($packageFolder)
    Execute-PnPQuery

    foreach ($file in (dir hackBot\temp\deploy -File)) 
    {
        $fileStream = New-Object IO.FileStream($file.FullName, [System.IO.FileMode]::Open)
        $fileCreationInfo = New-Object Microsoft.SharePoint.Client.FileCreationInformation
        $fileCreationInfo.Overwrite = $true
        $fileCreationInfo.ContentStream = $fileStream
        $fileCreationInfo.URL = $file
        $upload = $packageFolder.Files.Add($fileCreationInfo)
        $context.Load($upload)
        Execute-PnPQuery
    }

    #Write-Host -ForegroundColor Green "All the automatic steps are now completed!"
    #Write-Host "Please proceed with the manual steps documented on the Setup Guide!"

    $sppkgPath = (Get-Item -Path "hackBot\sharepoint\solution\bot.sppkg" -Verbose).FullName
    #Import-PnPAppPackage -Path $sppkgPath -Force
    Write-Host "You can find the .SPPKG file at the following path:" $sppkgPath



}
catch 
{
    Write-Host -ForegroundColor Red "Exception occurred!" 
    Write-Host -ForegroundColor Red "Exception Type: $($_.Exception.GetType().FullName)"
    Write-Host -ForegroundColor Red "Exception Message: $($_.Exception.Message)"
}

Write-Host "Press any key to continue ..."
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
