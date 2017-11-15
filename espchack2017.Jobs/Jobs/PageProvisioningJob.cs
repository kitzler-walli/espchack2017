using OfficeDevPnP.Core.Framework.TimerJobs;
using System.Text.RegularExpressions;
using OfficeDevPnP.Core.Pages;
using OfficeDevPnP.Core.Entities;

namespace espchack2017.Jobs
{
    public class PageProvisioningJob : JobBase
    {
        public override bool Execute(TimerJobRunEventArgs e)
        {
            string siteName = Regex.Replace(Job.Title, @"[^0-9a-zA-Z]+", "");
            if (siteName.Length > 25)
                siteName = siteName.Substring(0, 25);

            using (var context = GetClientContext(Job.SiteUrl))
            {
                ClientSidePage myPage = new ClientSidePage(context, ClientSidePageLayoutType.Article);
                
                ClientSideText txt1 = new ClientSideText() { Text = Job.Title };
                myPage.AddControl(txt1, 0);
                myPage.Save(siteName + ".aspx");

                return true;
            }
        }
    }
}
