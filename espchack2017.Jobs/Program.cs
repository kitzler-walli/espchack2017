using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;

namespace espchack2017.Jobs
{
    // To learn more about Microsoft Azure WebJobs SDK, please see https://go.microsoft.com/fwlink/?LinkID=320976
    class Program
    {
        // Please set the following connection strings in app.config for this WebJob to run:
        // AzureWebJobsDashboard and AzureWebJobsStorage
        static void Main()
        {
            //Functions.RunJob(new JobDefinition() { Definition = "espchack2017.Jobs.SiteProvisioningJob,espchack2017.Jobs", Email = "", Title = "Site 1" }, null);
            //Functions.RunJob(new JobDefinition() { Definition = "espchack2017.Jobs.PageProvisioningJob,espchack2017.Jobs", Email = "", Title = "Page 1", SiteUrl = "https://x.sharepoint.com/sites/site1" }, null);
            //Functions.RunJob(new JobDefinition() { Definition = "espchack2017.Jobs.DocProvisioningJob,espchack2017.Jobs", Email = "", Title = "Page 1", SiteUrl = "https://x.sharepoint.com/sites/site1" }, null);

            //return;

            var config = new JobHostConfiguration();

            if (config.IsDevelopment)
            {
                config.UseDevelopmentSettings();
            }

            var host = new JobHost(config);
            // The following code ensures that the WebJob will be running continuously
            host.RunAndBlock();
        }
    }
}
