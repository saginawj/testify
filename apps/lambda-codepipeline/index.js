var assert = require('assert');
var AWS = require('aws-sdk');
var http = require('http');
AWS.config.update({region: "us-east-1"});

exports.handler = function(event, context) {

    console.log("BEGIN LAMBDA-CODEPIPELINE");

    var codepipeline = new AWS.CodePipeline();

    // Retrieve the Job ID from the Lambda action
    var jobId = event["CodePipeline.job"].id;

    // Retrieve the value of UserParameters from the Lambda action configuration in AWS CodePipeline, in this case a URL which will be
    // health checked by this function.
    var url = "http://google.com"; //event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;

    // Notify AWS CodePipeline of a successful job
    var putJobSuccess = function(message) {
        var params = {
            jobId: jobId
        };
        codepipeline.putJobSuccessResult(params, function(err, data) {
            if(err) {
                context.fail(err);
            } else {
                context.succeed(message);
            }
        });
    };

    // Notify AWS CodePipeline of a failed job
    var putJobFailure = function(message) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: 'JobFailed',
                externalExecutionId: context.invokeid
            }
        };
        codepipeline.putJobFailureResult(params, function(err, data) {
            context.fail(message);
        });
    };

    // Validate the URL passed in UserParameters
    if(!url || url.indexOf('http://') === -1) {
        putJobFailure('The UserParameters field must contain a valid URL address to test, including http:// or https://');
        return;
    }

    // Helper function to make a HTTP GET request to the page.
    // The helper will test the response and succeed or fail the job accordingly
    var getPage = function(url, callback) {
        var text = "hello";
        console.log("BEGIN GET PAGE HELPER");
        callback(text);
    };

    getPage(url, function(finalText) {
        try {
            // Succeed the job
            console.log("BEGIN PUT-JOB-SUCCESS");
            putJobSuccess(finalText);
        } catch (ex) {
            // If any of the assertions failed then fail the job
            console.log("BEGIN PUT-JOB-FAILURE");
            putJobFailure(ex);
        }
    });
};