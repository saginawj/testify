console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    var tableName = "sampleTable";
    var datetime = new Date().getTime().toString();

    dynamodb.putItem({
        "TableName": tableName,
        "Item": {
            "id": {
                "N": event.id
            },
            "date": {
                "S": event.date
            },
            "harness": {
                "S": event.harness
            },
            "passpercentage": {
                "N": event.passpercentage
            }
        }
    }, function(err, data) {
        if (err) {
            context.fail('ERROR: Dynamo failed: ' + err);
        } else {
            console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
            context.succeed('SUCCESS');
        }
    });
}