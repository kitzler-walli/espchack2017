using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OfficeDevPnP.Core.Framework.TimerJobs;
using Microsoft.SharePoint.Client;
using Microsoft.Online.SharePoint.TenantAdministration;
using OfficeDevPnP.Core.Framework.Graph;
using System.Threading;
using OfficeDevPnP.Core.Entities;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;

namespace espchack2017.Jobs
{
    public class SiteProvisioningJob : JobBase
    {
        public override bool Execute(TimerJobRunEventArgs e)
        {
            string siteName = Regex.Replace(Job.Title, @"[^0-9a-zA-Z]+", "");
            if (siteName.Length > 25)
                siteName = siteName.Substring(0, 25);
            string siteUrl = Const.TenantUrl + "/sites/" + siteName;

            //JObject a = new JObject(Job.Message);
            //a.Add("text", "Working on it, please wait");
            //QueueHelper.AddJobQueueMessage(Job.Message);

            string siteTemplate = "SITEPAGEPUBLISHING#0";
            using (var adminContext = GetClientContext(Const.AdminSiteUrl))
            {
                var tenant = new Tenant(adminContext);
                if (tenant.CheckIfSiteExists(siteUrl, "Active"))
                {
                    Job.Message.Add("text", "It was already created: " + siteUrl);
                    QueueHelper.AddJobQueueMessage(Job.Message);
                    return true;
                }

                if (siteTemplate == "SITEPAGEPUBLISHING#0") //Communication site
                {

                    using (ClientContext ctx = GetClientContext(Const.TenantUrl))
                    {
                        var scci = new OfficeDevPnP.Core.Sites.CommunicationSiteCollectionCreationInformation
                        {
                            AllowFileSharingForGuestUsers = false,
                            SiteDesign = OfficeDevPnP.Core.Sites.CommunicationSiteDesign.Topic,
                            Title = Job.Title,
                            Description = Job.Title + "Description",
                            Url = siteUrl
                        };
                        ClientContext newSiteCtx = OfficeDevPnP.Core.Sites.SiteCollection.CreateAsync(ctx, scci).GetAwaiter().GetResult();

                        Job.Message.Add("text", "Here you go: "+ siteUrl);
                        QueueHelper.AddJobQueueMessage(Job.Message);
                        return true;
                    }
                }
                else
                {
                    adminContext.RequestTimeout = Timeout.Infinite;

                    // Configure the Site Collection properties
                    SiteEntity newSite = new SiteEntity();

                    newSite.Description = Job.Title + "Description";


                    newSite.Title = Job.Title;
                    newSite.Url = siteUrl;

                    newSite.Template = "STS#0";

                    tenant.CreateSiteCollection(newSite, true, true); // TODO: Do we want to empty Recycle Bin?

                    Console.WriteLine("Site \"{0}\" created.", siteUrl);


                    Job.Message.Add("text", "Here you go: " + siteUrl);
                    QueueHelper.AddJobQueueMessage(Job.Message);

                    return true;

                    //text
                }
            }




        }
        
    }
}
