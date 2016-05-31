//TODO: replace boiler-plate SNS code with code that puts message into Dynamo

//TODO required when run in AWS?
var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('EVENT:  \n', JSON.stringify(event, null, 2));
    console.log('passpercentage:  ', event.passpercentage)
    console.log('CONTEXT:  \n', context);
    //const message = event.Records[0].Sns.Message;
    //console.log('From SNS:', message);
    //callback(null, message);


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


};