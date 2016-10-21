var _                   = require('lodash');
var PropertiesReader    = require('properties-reader');
var AWS                 = require('aws-sdk');
var AlexaSkill          = require('./AlexaSkill');
AWS.config.update({region:'us-east-1'});
//update


var properties  = PropertiesReader('properties.txt');
var APP_ID      = "amzn1.echo-sdk-ams.app.2e216a09-3941-4ffc-b8ff-7ad544764bf1"; //properties.get('stuff.ifttt.key');

console.log(APP_ID);

var Testify = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Testify.prototype = Object.create(AlexaSkill.prototype);
Testify.prototype.constructor = Testify;

Testify.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Testify onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Testify.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Testify onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleOpenRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Testify.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Testify onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Testify.prototype.intentHandlers = {

    //adding second event handler
    "StartTestingIntent": function (intent, session, response) {
        handleStartTestingRequest(response);
    },
    //adding third event handler
    "CheckTestingStatusIntent": function (intent, session, response) {
        handleCheckTestingStatusRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Testify to test my code, or provide the status of the last deployment. Or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleOpenRequest(response) {
    var cardTitle = "Testify";
    var repromptText = "You can say things like, Run the Test Harness.   Or, What's the status of the deployment?";
    var speechText = "<p>Testify.</p> <p>Would you like to execute a test harness, or get the status of a test harness?</p>";
    var cardOutput = "Welcome to Testify, your home for automated testing?";

    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}

//This will eventually kickoff the Code Deployment
//TODO change logic to kick off CodePipeline
function handleStartTestingRequest(response) {

    console.log("START handleStartTestingRequest");

    // Create speech output
    var speechOutput = "Kicking off the testing pipeline now.";

    //TODO code extracted to codePipelineHelper
    var codepipeline = new AWS.CodePipeline();
    var pipelineName = "testify-newPipeline";

    var params = {
        name: pipelineName
    };

    console.log("Execute Start Pipleine");
    codepipeline.startPipelineExecution(params, function(err, data) {
        if (err){
            console.log("CODE PIPELINE FAILED:  ", pipelineName);
            console.log(err, err.stack);
        }
        else{
            console.log("CODE PIPELINE SUCCESS:  ", pipelineName);
            console.log(data);
            console.log(speechOutput);
            response.tellWithCard(speechOutput, "Testify", speechOutput);
        }
    });

    //moving these into above
    //console.log(speechOutput);
    //response.tellWithCard(speechOutput, "Testify", speechOutput);
}

//TODO move Dynamo code to dynamohelper
function handleCheckTestingStatusRequest(response) {

    //for Alexa
    var speechOutput = undefined;

    //for Dynamo
    var docClient = new AWS.DynamoDB.DocumentClient();
    var tableName = 'testResultsTable';
    var params = {
        TableName : tableName
    };

    docClient.scan(params, function dynamoScanResponse(err, data) {
        if (err) console.log(err);
        else {
            //TODO update to get last date based on Sort Key in new table
            console.log(data.Items);

            var a = _.maxBy(data.Items, function(o){return o.date});

            var date = a.date;
            var id = a.id;
            var harness = a.harness;
            var passpercentage = a.passpercentage;

            //console.log(data);
            console.log("Date: ", date);
            console.log("ID: ", id);

            speechOutput = "Here's your test results:   On " + date  + ", the " + harness + " harness had a pass percentage of " + passpercentage;
            console.log("SPEECH OUTPUT:  " + speechOutput);
            response.tellWithCard(speechOutput, "Testify", speechOutput);
        }
    });
}



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Testify src.
    var testify = new Testify();
    testify.execute(event, context);
};

