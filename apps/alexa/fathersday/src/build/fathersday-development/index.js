/*
*Calls out to https://www.whitehouse.gov/facts/json/all/{caegory}
* Description of API: https://www.whitehouse.gov/developers/policy-snapshots-json-feed
* Returns list of policies in that category
* Defaults to all categories
 */

 var rayaText = '{ "employees" : [' +
'{ "firstName":"John" , "lastName":"Doe" },' +
'{ "firstName":"Anna" , "lastName":"Smith" },' +
'{ "firstName":"Peter" , "lastName":"Jones" } ]}';

var APP_ID = 'amzn1.echo-sdk-ams.app.09d0d0d0-d9c6-4319-b7b1-99440ac40bae';

var https = require('https');

var AlexaSkill = require('./AlexaSkill');

/**
 * URL prefix for Whitehouse
 */
//TODO concatenate with 2 params vs. full call
var urlPrefix = "https://www.whitehouse.gov/facts/json/";

/**
 * Variable defining number of events to be read at one time
 */
//TODO change pagination to 1 from 3
var paginationSize = 1;

/**
 * Variable defining the length of the delimiter between events
 */
var delimiterSize = 2;

var defaultCategory = "all";

var PoliticsSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

PoliticsSkill.prototype = Object.create(AlexaSkill.prototype);
PoliticsSkill.prototype.constructor = PoliticsSkill;

PoliticsSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("PoliticsSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

PoliticsSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("PoliticsSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

PoliticsSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

PoliticsSkill.prototype.intentHandlers = {

    "GetFirstEventIntent": function (intent, session, response) {
        handleFirstEventRequest(intent, session, response);
    },

    "GetNextEventIntent": function (intent, session, response) {
        handleNextEventRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "I can tell you some factions about yourself.  Just say Raya, or Ethan, or Sammy.";
        var repromptText = "Who do you want to know more about?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

function getWelcomeResponse(response) {
    var cardTitle = "Father's Day?";
    var speechText = "Hi Raya, Ethan, and Sammy.  Welcome to our home.  My name is Alexa, and I'm really happy that you are spending Father's Day with me.  Jon and Nancy are really glad that you came all the way from New Jersey.  My only request is that you don't chase Bugsy and Squeaker.  They would really appreciate that.";
    var repromptText = " ";
    var cardOutput = "Father's Day";

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

function handleFirstEventRequest(intent, session, response) {
    
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleNextEventRequest(intent, session, response) {
   
}



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HistoryBuff Skill.
    var skill = new PoliticsSkill();
    skill.execute(event, context);
};

