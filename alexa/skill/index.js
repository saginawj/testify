/**
 * To update this later.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Animal Facts for an animal fact"
 *  Alexa: "Here's your animal fact: ..."
 */

/**
 * App ID for the skill
 */
//TODO: Move APP_ID to configdata.json file
var APP_ID = "amzn1.echo-sdk-ams.app.2e216a09-3941-4ffc-b8ff-7ad544764bf1"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing animal facts.
 */
var MY_FACTS = [
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "It is raining now.",
    "Today is Memorial Day.",
    "I got wet this morning.",
    "I got wet this morning.",
    "I got wet this morning.",
    "I got wet this morning.",
    "I got wet this morning.",
    "I got wet this morning.",
    "I got wet this morning.",
    "Today is Memorial Day.",
    "Today is Memorial Day.",
    "Today is Memorial Day.",
    "Today is Memorial Day.",
    "Today is Memorial Day.",
    "Today is Memorial Day.",
    "Today is Memorial Day.",
    "Today is Memorial Day.",
    "Today is a good day for a movie."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var SpaceGeek = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SpaceGeek.prototype = Object.create(AlexaSkill.prototype);
SpaceGeek.prototype.constructor = SpaceGeek;

SpaceGeek.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("AnimalFacts onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SpaceGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("AnimalFacts onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SpaceGeek.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("AnimalFacts onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SpaceGeek.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
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
    // Get a random animal fact from the space facts list
    var factIndex = Math.floor(Math.random() * MY_FACTS.length);
    var fact = MY_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your animal fact: " + fact;

    console.log("Fact:  " + fact);

    response.tellWithCard(speechOutput, "AnimalFacts", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var spaceGeek = new SpaceGeek();
    spaceGeek.execute(event, context);
};

