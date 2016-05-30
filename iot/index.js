var request = require('request');
var AWS = require('aws-sdk');
var fs = require("fs");
AWS.config.update({region:'us-east-1'});
var content = fs.readFileSync("configdata.json");
var json = JSON.parse(content);
var IFTTTkey = json.iftttkey;



//this is called when the AWS Button is pressed and event data is passed as well
exports.handler = function(event, context) {
    var color = "";
    console.log("Received AWS Button event: " + event.clickType + ". Firing IFTTT Maker Trigger...");
    if(event.clickType == "single"){
        color = "RED";
    }
    else{
        color = "GREEN";
    }
    request('https://maker.ifttt.com/trigger/' + 'AWS-'+ color + '/with/key/' + IFTTTkey, function (error, response, body) {
            console.log("Complete! Response: ", response.statusCode);
        }
    )};
