'use strict';

var request = require('request');
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

// To replace with asych file read
var fs = require("fs");
var content = fs.readFileSync("configdata.json");
var json = JSON.parse(content);
var IFTTTkey = json.iftttkey;
console.log("IFTTTKey:  ", IFTTTkey);

//HANDLE DYNAMODB EVENT
exports.handler = (event, context, callback) => {
    //READ FROM DYNAMODB UPDATE
    //console.log('Received event:', JSON.stringify(event, null, 2));

    var passPercentage = null;
    var color = null;

    event.Records.forEach((record) => {
        console.log('RECORD ID: ' + record.eventID);
        console.log('EVENT NAME:  ' + record.eventName);
        console.log('PASS PERCENTAGE:  ' + record.dynamodb.NewImage.passpercentage.S)
     //console.log('RECORD JSON: %j', record.dynamodb);
    passPercentage = record.dynamodb.NewImage.passpercentage.S
});

    //COLOR LOGIC
    if(passPercentage >= 80){
        color = "GREEN";
    }
    else{
        color = "RED";
    }
    console.log("COLOR:  " + color);

    //IFTTT
    //console.log("Received AWS Button event: " + event.clickType + ". Firing IFTTT Maker Trigger...");
    console.log("SEND TO IFTTT");
    request('https://maker.ifttt.com/trigger/' + 'AWS-'+ color + '/with/key/' + IFTTTkey, function (error, response, body) {
            console.log("Complete! Response: ", response.statusCode);
            console.log("IFTTT RESPONSE BODY:  ", body);
        }
    )
    console.log('https://maker.ifttt.com/trigger/' + 'AWS-'+ color + '/with/key/' + IFTTTkey);
};
