using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using System.Reflection;
using Microsoft.SharePoint.Client;
using System.Security;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage;
using System.Configuration;

namespace espchack2017.Jobs
{
    public class Functions
    {

        // This function will get triggered/executed when a new message is written 
        // on an Azure Queue called queue.
        public static void ProcessQueueMessage([QueueTrigger("bot-queue")] string message, TextWriter log)
        {
            log.WriteLine(message);
            var mm = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(message);
            var kind = mm.SelectToken("kind").Value<string>();
            var title = mm.SelectToken("title").Value<string>();
            switch (kind)
            {
                case "site":
                    RunJob(new JobDefinition() { Definition = "espchack2017.Jobs.SiteProvisioningJob,espchack2017.Jobs", Message = mm, Email = "", Title = title, SiteUrl = "https://x.sharepoint.com/sites/bot" }, log);
                    break;
                case "doc":
                    RunJob(new JobDefinition() { Definition = "espchack2017.Jobs.DocProvisioningJob,espchack2017.Jobs", Message = mm, Email = "", Title = title, SiteUrl = "https://x.sharepoint.com/sites/bot" }, log);
                    break;
                case "page":
                    RunJob(new JobDefinition() { Definition = "espchack2017.Jobs.PageProvisioningJob,espchack2017.Jobs", Message = mm, Email = "", Title = title, SiteUrl= "https://x.sharepoint.com/sites/bot" }, log);
                    break;
            }
        }

        public static void RunJob(JobDefinition jd, TextWriter output)
        {
            try
            {
                JobBase bgJob = CreateInstance(jd, output);
                if (bgJob == null)
                {
                    
                }
                else
                {
                    try
                    {
                        bool useThreading =
#if DEBUG
                false;
#else
                true;
#endif
                        bgJob.UseThreading = useThreading;
                        bgJob.Init(jd, output);

                        
                        bgJob.UseOffice365Authentication(Const.UserName, Const.Password);
                        bgJob.SetEnumerationCredentials(Const.UserName, Const.Password);

                        bgJob.Run();
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    finally
                    {

                    }
                }
            }
            catch (Exception ex)
            {
                
            }
        }

        public static JobBase CreateInstance(JobDefinition jd, TextWriter output)
        {
            try
            {
                string[] arr = jd.Definition.Split(new string[] { "," }, 2, StringSplitOptions.RemoveEmptyEntries);
                string typeName = arr[0];
                string assemblyName = arr[1];

                if (!string.IsNullOrEmpty(typeName))
                {
                    Assembly assembly = null;
                    if (!string.IsNullOrEmpty(assemblyName))
                    {
                        assembly = Assembly.Load(assemblyName);
                    }
                    else
                    {
                        assembly = Assembly.GetExecutingAssembly();
                    }

                    Type type = assembly.GetType(typeName, false, true);
                    if (type != null)
                    {
                        ConstructorInfo constructor = type.GetConstructor(Type.EmptyTypes);
                        if (null != constructor)
                        {
                            return constructor.Invoke(null) as JobBase;
                        }
                        //ConstructorInfo constructor = type.GetConstructor(new Type[3] { typeof(string), typeof(JobDefinition), typeof(TextWriter) });
                        //if (null != constructor)
                        //{
                        //    return constructor.Invoke(new object[] { typeName, jd, output }) as BackgroundJobBase;
                        //}
                    }
                }
            }
            catch
            {
            }

            return null;
        }


    }


    //{"address":{"id":"e96f278dd0ed4daa8dbebda4792a41f9|0000000","channelId":"webchat","user":{"id":"Je5xSUTBGBR","name":"You"},"conversation":{"id":"e96f278dd0ed4daa8dbebda4792a41f9"},"bot":{"id":"ESPCHack2017@jgY5gzB1Xuw","name":"ESPCHack2017"},"serviceUrl":"https://webchat.botframework.com/"},"text":"Queue Test"}

    public class BotMessage
    {
        /// <summary>
        /// A User's username. eg: "sergiotapia, mrkibbles, matumbo"
        /// </summary>
        [JsonProperty("kind")]
        public string kind { get; set; }

        [JsonProperty("title")]
        public string title { get; set; }
        [JsonProperty("address")]
        public string address { get; set; }


        //{"kind":"site","title":"ESPC Hackathon Site",
        //"address":{"id":"572c2ec2963849b59fa776c7b5fa9be6|0000009","channelId":"webchat",
        //"user":{"id":"13U1uREM3JQ","name":"You"},"conversation":{"id":"572c2ec2963849b59fa776c7b5fa9be6"},
        //"bot":{"id":"ESPCHack2017@jgY5gzB1Xuw","name":"ESPCHack2017"},"serviceUrl":"https://webchat.botframework.com/"}}

        //{"kind":"site","title":"ESPC Hackathon Site"}
    }

    public static class QueueHelper
    {

        private static CloudQueue _JobsQueue = null;

        public static CloudQueue JobQueue
        {
            get
            {
                if (_JobsQueue == null)
                {
                    var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["AzureWebJobsStorage"].ToString());
                    var queueClient = storageAccount.CreateCloudQueueClient();
                    _JobsQueue = queueClient.GetQueueReference("webjob-queue");
                    _JobsQueue.CreateIfNotExists();
                }
                return _JobsQueue;
            }
        }

 
        public static void AddJobQueueMessage(object jd)
        {
            var jobJson = JsonConvert.SerializeObject(jd);
            CloudQueueMessage message = new CloudQueueMessage(jobJson);
            
            JobQueue.AddMessage(message, null);
        }

    }
}
