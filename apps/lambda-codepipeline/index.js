//TODO: replace boiler-plate SNS code with code that puts message into Dynamo

var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

'use strict';
console.log('Loading function');

exports.handler = function(event, context) {

    var codepipeline = new AWS.CodePipeline();

    // Retrieve the Job ID from the Lambda action
    var jobId = event["CodePipeline.job"].id;

    //use this as a user param
    //var userParameters = event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;

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
    var getPage = function(text, callback) {
        var pageObject = "hello";
        callback(pageObject)
    };

    var url = "mytestdata";

    getPage(url, function(returnedPage) {
        try {
            // Succeed the job
            putJobSuccess("Tests passed.");
        } catch (ex) {
            // If any of the assertions failed then fail the job
            putJobFailure(ex);
        }
    });
};


/*
    //TODO use the dynamohelper once its extracted into its own module

    var docClient = new AWS.DynamoDB.DocumentClient();

    var tableName = 'testResultsTable';
    var id = '1010' //to replace

    //these will be pulled from the EVENT via CodePipeline
    var params = {
        TableName : 'testResultsTable',
        Item: {
            id: '1050',
            date: 'May31',
            harness: 'regression',
            passpercentage:  '80'
        }
    };

    docClient.put(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
    });


;
    */