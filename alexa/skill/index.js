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
var APP_ID = "amzn1.echo-sdk-ams.app.2e216a09-3941-4ffc-b8ff-7ad544764bf1";

var AWS = require('aws-sdk');
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

            console.log(data.Items);
            var count = data.Items.length -1;
            var date = data.Items[count].date;
            var id = data.Items[count].id;
            var harness = data.Items[count].harness;
            var passpercentage = data.Items[count].passpercentage;

            //console.log(data);
            console.log("Date: ", date);
            console.log("ID: ", id);

            speechOutput = "Here's your test results:   On " + date  + ", the " + harness + " harness had a pass percentage of " + passpercentage;
            console.log("SPEECH OUTPUT:  " + speechOutput);
            response.tellWithCard(speechOutput, "Testify", speechOutput);
        }
    });


    /*
    //this code needs to be executed after getting the date of the latst record from the scan
    var speechOutput = undefined;
    params = {};
    params.TableName = "testResultsTable";
    params.Key = {id : "1010"};
    theAnswer = "";

    docClient.get(params, function(err, data) {
        if (err) {
            console.log("GetItem Error");
            console.log(err)
            speechOutput = "Sorry, I had trouble pulling the resuilts.  You'll need to check the old fashion way.  With your eyes";
            response.tellWithCard(speechOutput, "Testify", speechOutput);
        }
        else {
            console.log("Dynamo Get Successful.  Data Below");
            console.log(data);

            var passPercentage  = data.Item.passpercentage;
            var date            = data.Item.date;
            var harness         = data.Item.harness;

            speechOutput = "Here's your test resuilts:   On " + date  + ", the " + harness + " harness had a pass percentage of " + passPercentage;
            console.log("SPEECH OUTPUT:  " + speechOutput);
            response.tellWithCard(speechOutput, "Testify", speechOutput);
        }
    });
    */
}



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Testify skill.
    var testify = new Testify();
    testify.execute(event, context);
};

