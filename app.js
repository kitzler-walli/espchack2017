/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var azure = require('azure-storage');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);


// Intercept trigger event (ActivityTypes.Trigger)
bot.on('trigger', function (message) {
    // handle message from trigger function
    var msgType = message.type;
    if(msgType == 'webjobResponse'){
        var queuedMessage = message.value;
        var reply = new builder.Message()
            .address(queuedMessage.address)
            .text(queuedMessage.text);
        bot.send(reply);
    }
});

// Handle message from user
bot.dialog('/', [
    function (session) {
        session.userData.name = "Stephan";
        builder.Prompts.text(session, "Hello " + session.userData.name + " - good to see you back - up for another modern teamsite today?");
    },
    function (session, results) {
        session.userData.name = results.response; //assume NO
        builder.Prompts.choice(session, "OK - what else would you like to create?", ["Classic Teamsite", "Communication site"]); 
    },
    function (session, results) {
        session.userData.coding = results.response; //assume "A Communication site"
        session.send("What would you like to name your communication site?");
        setTimeout(function(){
            builder.Prompts.text(session, "Would you like me to name it 'ESPC Hackathon Site'?");
        }, 3000);
    },
    function (session, results) {
        //session.userData.name = results.response; //assume YES
        var queuedMessage = { kind: 'site', title: 'ESPC Hackathon Site', address: session.message.address };
        
        var queueSvc = azure.createQueueService(process.env.AzureWebJobsStorage);
        queueSvc.createQueueIfNotExists('bot-queue', function(err, result, response){
            if(!err){
                // Add the message to the queue
                var queueMessageBuffer = new Buffer(JSON.stringify(queuedMessage)).toString('base64');
                queueSvc.createMessage('bot-queue', queueMessageBuffer, function(err, result, response){
                    if(!err){
                        // Message inserted
                        session.send("OK - I started the process to create your new Communication site. I'll send you the URL as soon as it is finished."); 
                    } else {
                        // this should be a log for the dev, not a message to the user
                        session.send('There was an error starting the site creation process');
                    }
                });
            } else {
                // this should be a log for the dev, not a message to the user
                session.send('There was an error starting the site creation process');
            }
        });
    },
    /*function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
    }*/
]);

/*function (session) {
    var queuedMessage = { address: session.message.address, text: session.message.text };




    // add message to queue
    session.sendTyping();
    var queueSvc = azure.createQueueService(process.env.AzureWebJobsStorage);
    queueSvc.createQueueIfNotExists('bot-queue', function(err, result, response){
        if(!err){
            // Add the message to the queue
            var queueMessageBuffer = new Buffer(JSON.stringify(queuedMessage)).toString('base64');
            queueSvc.createMessage('bot-queue', queueMessageBuffer, function(err, result, response){
                if(!err){
                    // Message inserted
                    session.send('Your message (\'' + session.message.text + '\') has been added to a queue, and it will be sent back to you via a Function');
                } else {
                    // this should be a log for the dev, not a message to the user
                    session.send('There was an error inserting your message into queue');
                }
            });
        } else {
            // this should be a log for the dev, not a message to the user
            session.send('There was an error creating your queue');
        }
    });

});
*/