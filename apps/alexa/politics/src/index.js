/*
*Calls out to https://www.whitehouse.gov/facts/json/all/{caegory}
* Description of API: https://www.whitehouse.gov/developers/policy-snapshots-json-feed
* Returns list of policies in that category
* Defaults to all categories
 */

var APP_ID = 'amzn1.echo-sdk-ams.app.150d504d-a9bd-40b7-8631-b1c931c812d6';

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
        var speechText = "With Washington Insider, you can get information about policy topics at the White House.  " +
            "For example, you could say, tell me about economics, or tell me about education. Now, which day do you want?";
        var repromptText = "Which category do you want?";
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
    var cardTitle = "Washington Insider?";
    var repromptText = "With Washington Insider, you can ask the White House about political progress in America.  Just ask: What's up with economy?  The categories are economy, education, and healthcare.";
    var speechText = "<p>Washington Insider.</p> <p>What category would you like?  The three categories are education, economy, and healthcare?</p>";
    var cardOutput = "Washington Insider. What category would you like information about?";

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
    //console.log("**INTENTS** ", intent);
    var categorySlot = intent.slots.category;
    var category = "";
    var repromptText = "With Washington Insider, you can ask the White House about political progress in America.  Just ask: What's up with economy?  The categories are economy, education, and healthcare.";
    var sessionAttributes = {};
    sessionAttributes.index = paginationSize;

    console.log("**CATEGORY SLOT** ", categorySlot);
    if (categorySlot && categorySlot.value) {
        category = categorySlot.value;
    } else {
        category = defaultCategory;
    }

    console.log("**CATEGORY** ", category);

    var prefixContent = "<p>Here are the latest policies for " + category + "</p>";

    var cardContent = "New policies";

    var cardTitle = "Categories in " + category;

    getJsonEventsFromWhiteHouse(category, function (events) {
        var speechText = "",
            i;
        sessionAttributes = events;
        session.attributes = sessionAttributes;
        if (events.length == 0) {
            speechText = "There is a problem connecting to White House website at this time. Please try again later.";
            cardContent = speechText;
            response.tell(speechText);
        } else {
            for (i = 0; i < paginationSize; i++) {
                cardContent = cardContent + events[i] + " ";
                speechText = "<p>" + speechText + events[i] + "</p> ";
            }
            speechText = speechText + " <p>Want another policy topic?</p>";
            var speechOutput = {
                speech: "<speak>" + prefixContent + speechText + "</speak>",
                type: AlexaSkill.speechOutputType.SSML
            };
            var repromptOutput = {
                speech: repromptText,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
        }
    });
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleNextEventRequest(intent, session, response) {
    var cardTitle = "More Policies",
        sessionAttributes = session.attributes,
        result = sessionAttributes;
        speechText = "",
        cardContent = "",
        repromptText = "Do you want to know more about what happened in this category?",
        i;
    console.log("**RESULT**: ", result);

    if (!result) {
        speechText = "With Washington Insider, you can get the latest political news.   What category do you want?";
        cardContent = speechText;
    } else if (sessionAttributes.index >= result.length) {
        speechText = "There are no more policies for this category. Try another category by saying <break time = \"0.3s\"/> get policies for education.";
        cardContent = "There are no more policies for this category.  Try another category by saying: get policies for education.";
    } else {
        for (i = 0; i < paginationSize; i++) {
            if (sessionAttributes.index>= result.length) {
                break;
            }
            speechText = speechText + "<p>" + result[sessionAttributes.index] + "</p> ";
            speechText = speechText + " <p>Want another policy topic?</p>";
            cardContent = cardContent + result[sessionAttributes.index] + " ";
            sessionAttributes.index++;
        }
        if (sessionAttributes.index < result.length) {
            speechText = speechText + " Want more policy information?";
            cardContent = cardContent + " Want more policy information?";
        }
    }
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
}

function getJsonEventsFromWhiteHouse(category, eventCallback) {
    var url = urlPrefix + "all/" + category;
    console.log("**URL** " + url);

    https.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = parseJson(body);
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function parseJson(inputText){

    var issues = {};
    issues.index = paginationSize;
    var json = JSON.parse(inputText);
    var count = json.length;
    console.log("**EVENT COUNT** ", count);

    for(i=0; i<count; i++) {
        issues[i] = json[i].body;
    }
    return issues;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HistoryBuff Skill.
    var skill = new PoliticsSkill();
    skill.execute(event, context);
};

