var assert  = require('assert');
var AWS     = require('aws-sdk');
var http    = require('http');
var _       = require('lodash');

AWS.config.update({region: "us-east-1"});

//TODO remove all the legacy boilerplate code
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

    // Helper function to make a HTTP GET request to the page.
    // The helper will test the response and succeed or fail the job accordingly
    //TODO this will eventually be used to write results from the harness
    var dynamoUpdate = function(url, callback) {
        var text = "hello";
        console.log("BEGIN GET PAGE HELPER");

        var docClient = new AWS.DynamoDB.DocumentClient();

        var tableName = 'testResultsTable';

        var d = new Date();
        var date = d.toUTCString();
        var harness = 'regression';
        var passpercent = _.random(100);


        //TODO get test results from CCAT Dynamo
        var params = {
            TableName : tableName,
            Item: {
                id: jobId,
                date: date,
                harness: harness,
                passpercentage: passpercent
            }
        };

        //this call will complete after the pipeline callback reports success, which is ok
        console.log("BEGIN DYNAMO CALL");
        docClient.put(params, function(err, data) {
            if (err) {
                console.log("DYNAMO ERROR");
                console.log(err)
            }
            else {
                console.log("DYNAMO SUCCESS");
                console.log(data);
            };
        });

        console.log("END GET PAGE HELPER.  CALL THE CALLBACK");

        callback(text);
    };

    dynamoUpdate(url, function(finalText) {
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