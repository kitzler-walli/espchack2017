using System.Collections.Generic;
using OfficeDevPnP.Core.Framework.TimerJobs;
using System.IO;
using System;
using Microsoft.SharePoint.Client;

namespace espchack2017.Jobs
{
    public abstract class JobBase : TimerJob
    {
        protected JobDefinition Job;
        public JobBase() : base("Job")
        {

        }

        public void Init(JobDefinition job, TextWriter output)
        {
            Job = job;
            TimerJobRun += BackgroundJobBase_TimerJobRun;
        }

        public override List<string> UpdateAddedSites(List<string> addedSites)
        {
            addedSites.Clear();

            this.AddSite(Const.TenantUrl);

            return addedSites;
        }

        private void BackgroundJobBase_TimerJobRun(object sender, TimerJobRunEventArgs e)
        {
            try
            {
                e.CurrentRunSuccessful = Execute(e);
            }
            catch (Exception ex)
            {
                e.CurrentRunSuccessful = false;
            }
        }

        public abstract bool Execute(TimerJobRunEventArgs e);


        public static ClientContext GetClientContext(string url)
        {
            return new ClientContext(url) { Credentials = Const.Credentials };
        }
    }
}