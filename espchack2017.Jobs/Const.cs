using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace espchack2017.Jobs
{
    public static class Const
    {

        public static string UserName
        {
            get { return ""; }
        }
        public static SecureString Password
        {
            get {

                SecureString sec_pass = new SecureString();
                Array.ForEach("".ToArray(), sec_pass.AppendChar);
                return sec_pass;

            }
        }

        public static SharePointOnlineCredentials Credentials
        {
            get
            {
                
                return new Microsoft.SharePoint.Client.SharePointOnlineCredentials(UserName, Password);
            }
        }

        public static string AdminSiteUrl = "https://x-admin.sharepoint.com";
        public static string TenantUrl = "https://x.sharepoint.com";

    }
}
