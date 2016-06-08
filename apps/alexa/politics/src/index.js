/*
*Calls out to https://www.whitehouse.gov/facts/json/all/{caegory}
* Returns list of policies in that category
* Defaults to all categories
 */

var APP_ID = 'amzn1.echo-sdk-ams.app.150d504d-a9bd-40b7-8631-b1c931c812d6';

var https = require('https');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * URL prefix for Whitehouse
 */
//TODO concatenate with 2 params vs. full call
var urlPrefix = "https://www.whitehouse.gov/facts/json/";  //sample is: https://www.whitehouse.gov/facts/json/whatsnext/education
//var urlPrefix = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext=&exsectionformat=plain&redirects=&titles=';

/**
 * Variable defining number of events to be read at one time
 */
//TODO change pagination to 1 from 3
var paginationSize = 3;

/**
 * Variable defining the length of the delimiter between events
 */
var delimiterSize = 2;

var defaultCategory = "all";

var HistoryBuffSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

HistoryBuffSkill.prototype = Object.create(AlexaSkill.prototype);
HistoryBuffSkill.prototype.constructor = HistoryBuffSkill;

HistoryBuffSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HistoryBuffSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

HistoryBuffSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HistoryBuffSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

HistoryBuffSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

HistoryBuffSkill.prototype.intentHandlers = {

    "GetFirstEventIntent": function (intent, session, response) {
        handleFirstEventRequest(intent, session, response);
    },

    "GetNextEventIntent": function (intent, session, response) {
        handleNextEventRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "With What's Up, Obama, you can get information about policy topics at the White House.  " +
            "For example, you could say economics, or education. Now, which day do you want?";
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
    var cardTitle = "What's Up, Obama?";
    var repromptText = "With What's Up, Obama, you can ask President Obama about political progress at the White House.  Just ask: What's up with with economy?  or What's up with Education.  What category would you like?";
    var speechText = "<p>What's Up, Obama.</p> <p>What category would you like?  The five categories are education, economy, energy, healthcare, or tax cuts?</p>";
    var cardOutput = "What's Up, Obama. What category would you like information about?";

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

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleFirstEventRequest(intent, session, response) {
    //console.log("**INTENTS** ", intent);
    var categorySlot = intent.slots.category;
    var category = "";
    var repromptText = "With What's Up, Obama, you can ask President Obama about political progress at the White House.  For example, you can ask about education or economy.  What category would you like?";

    var sessionAttributes = {};
    // Read the first 3 events, then set the count to 3
    sessionAttributes.index = paginationSize;

    // If the user provides a date, then use that, otherwise use today
    // The date is in server time, not in the user's time zone. So "today" for the user may actually be tomorrow
    console.log("**CATEGORY SLOT** ", categorySlot);
    if (categorySlot && categorySlot.value) {
        category = categorySlot.value;
    } else {
        category = defaultCategory;
    }

    console.log("**CATEGORY** ", category);

    var prefixContent = "<p>Here are the latest policies</p>";
    //var prefixContent = "<p>For " + category + ", here is the latest news" + ", </p>";
    var cardContent = "New policies";

    var cardTitle = "Categories in " + category;

    getJsonEventsFromWikipedia(category, function (events) {
        //console.log("**EVENTS** ", events);
        var speechText = "",
            i;
        sessionAttributes = events;
        //sessionAttributes.text = events;
        session.attributes = sessionAttributes;
        if (events.length == 0) {
            speechText = "There is a problem connecting to White House dot gov at this time. Please try again later.";
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
    var cardTitle = "More policies",
        sessionAttributes = session.attributes,
        result = sessionAttributes;
        //result = sessionAttributes.text,
        speechText = "",
        cardContent = "",
        repromptText = "Do you want to know more about what happened in this category?",
        i;
    if (!result) {
        speechText = "With What's Up, Obama, you can get the latest political news.   What category do you want?";
        cardContent = speechText;
    } else if (sessionAttributes.index >= result.length) {
        speechText = "There are no more policies for this category. Try another category by saying <break time = \"0.3s\"/> get policies for education.";
        cardContent = "There are no more events for this date. Try another date by saying, get events for august thirtieth.";
    } else {
        for (i = 0; i < paginationSize; i++) {
            if (sessionAttributes.index>= result.length) {
                break;
            }
            speechText = speechText + "<p>" + result[sessionAttributes.index] + "</p> ";
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

//TODO pass in category and type
function getJsonEventsFromWikipedia(category, eventCallback) {
    var url = urlPrefix + "all/" + category;
    console.log("**URL** " + url);

    https.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            //console.log("**RESPONSE BODY** ", body);
            var stringResult = parseJson(body);
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

//TODO add parsing logic from parser.js
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

//TODO remove old parser
function parseJsonOld(inputText) {
    // sizeOf (/nEvents/n) is 10
    var text = inputText.substring(inputText.indexOf("\\nEvents\\n")+10, inputText.indexOf("\\n\\n\\nBirths")),
        retArr = [],
        retString = "",
        endIndex,
        startIndex = 0;
    //console.log("**PARSE TEXT** ", text);

    if (text.length == 0) {
        return retArr;
    }

    while(true) {
        endIndex = text.indexOf("\\n", startIndex+delimiterSize);
        var eventText = (endIndex == -1 ? text.substring(startIndex) : text.substring(startIndex, endIndex));
        // replace dashes returned in text from Wikipedia's API
        eventText = eventText.replace(/\\u2013\s*/g, '');
        // add comma after year so Alexa pauses before continuing with the sentence
        eventText = eventText.replace(/(^\d+)/,'$1,');
        eventText = 'In ' + eventText;
        startIndex = endIndex+delimiterSize;
        retArr.push(eventText);
        if (endIndex == -1) {
            break;
        }
    }
    if (retString != "") {
        retArr.push(retString);
    }
    retArr.reverse();
    return retArr;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HistoryBuff Skill.
    var skill = new HistoryBuffSkill();
    skill.execute(event, context);
};

