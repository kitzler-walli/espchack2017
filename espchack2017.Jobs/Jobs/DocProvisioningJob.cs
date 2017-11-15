using OfficeDevPnP.Core.Framework.TimerJobs;
using System.Text.RegularExpressions;
using OfficeDevPnP.Core.Sites;
using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Entities;
using System;
using System.Text;

namespace espchack2017.Jobs
{
    public class DocProvisioningJob : JobBase
    {
        public override bool Execute(TimerJobRunEventArgs e)
        {
            using (var ctx = GetClientContext(Job.SiteUrl))
            {
                FileCreationInformation createFile = new FileCreationInformation();
                createFile.Url = "test.txt";
                //use byte array to set content of the file
                string somestring = "hello there";
                byte[] toBytes = Encoding.ASCII.GetBytes(somestring);

                createFile.Content = toBytes;

                List spList = ctx.Web.Lists.GetByTitle("Documents");
                File addedFile = spList.RootFolder.Files.Add(createFile);
                ctx.Load(addedFile);
                ctx.ExecuteQuery();

                ListItem item = addedFile.ListItemAllFields;
                item["Title"] = "File generated using Code";
                item.Update();
                ctx.Load(item);
                ctx.ExecuteQuery();

                return true;
            }
        }
    }
}
