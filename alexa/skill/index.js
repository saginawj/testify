/**
 * To update this later.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Testify to ..."
 */

/**
 * App ID for the skill
 */
//TODO: Move APP_ID to configdata.json file
var APP_ID = "amzn1.echo-sdk-ams.app.2e216a09-3941-4ffc-b8ff-7ad544764bf1"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var AWS = require('aws-sdk');
//var DOC = require("dynamodb-doc");
AWS.config.update({region:'us-east-1'});

//TODO: remove default strings and events
var MY_FACTS = [
    "This is Fact 1.",
    "This is Fact 2.",
    "This is Fact 3."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

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
    console.log("AnimalFacts onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
    //Additional Handlers
    handleStartTestingRequest(response);
    handleCheckTestingStatusRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Testify.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("AnimalFacts onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Testify.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

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
function handleNewFactRequest(response) {
    // Get a random animal fact from the animals facts list
    var factIndex = Math.floor(Math.random() * MY_FACTS.length);
    var fact = MY_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your animal fact: " + fact;

    console.log("Fact:  " + fact);

    response.tellWithCard(speechOutput, "AnimalFacts", speechOutput);
}

//This will eventually kickoff the Code Deployment
//TODO change logic to kick off CodePipeline
function handleStartTestingRequest(response) {

    // Create speech output
    var speechOutput = "Kicking off the testing pipeline now.";

    //TODO code extracted to codePipelineHelper
    var codepipeline = new AWS.CodePipeline();
    var pipelineName = "testify-pipeline";

    var params = {
        name: pipelineName
    };
    codepipeline.startPipelineExecution(params, function(err, data) {
        if (err){
            console.log("CODE PIPELINE FAILED:  ", pipelineName);
            console.log(err, err.stack);
        }
        else{
            console.log("CODE PIPELINE SUCCESS:  ", pipelineName);
            console.log(data);
        }
    });

    console.log(speechOutput);

    response.tellWithCard(speechOutput, "Testify", speechOutput);
}

//TODO when this runs, the 'answer' is empty bc i dont know Node well enough yet.  Will need to fix.
function handleCheckTestingStatusRequest(response) {

    // Create speech output
    var speechOutput = "Sample Text";

    var docClient = new AWS.DynamoDB.DocumentClient();

    params = {};
    params.TableName = "testResultsTable";
    params.Key = {id : "1010"};
    theAnswer = "";

    console.log("Before GetItem");

    docClient.getItem(params, function(err, data) {
        if (err) {
            console.log(err); // an error occurred
        }
        else {
            console.log("The Data:  ", data); // successful response
            theAnswer = data.Item.passpercentage;
            console.log("The Answer from inside GetItem  :", theAnswer);
        }
    });


    console.log("The Answer outside GetItem  :", theAnswer);

    response.tellWithCard(speechOutput, "Testify", speechOutput);
}



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Testify skill.
    var testify = new Testify();
    testify.execute(event, context);
};

