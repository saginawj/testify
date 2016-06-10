console.log('Loading event');
var AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});
var dynamodb = new AWS.DynamoDB();

//using doc client
var DOC = require('dynamodb-doc');
var docClient = new DOC.DynamoDB();






exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));
    console.log("EVENT:  ", event);
    console.log("CONTEXT: ", context);
    console.log("OPERATION: ", event.operation);

    var tableName = "sampleTable";

    var docCallback = function(err, data) {
        console.log("**RECEIVED DYNAMO CALLBACK**");
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    }

    var params = {};
    params.TableName = tableName;
    params.Item = event.payload.item;

    console.log("**EXECUTE DYNAMO CALL**");
    docClient.putItem(params, docCallback);

    /*
    dynamodb.putItem({
        "TableName": tableName,
        "Item": {
            "id": {
                "N": event.payload.item.id
            },
            "date": {
                "S": event.payload.item.date
            },
            "harness": {
                "S": event.payload.item.harness
            },
            "passpercentage": {
                "N": event.payload.item.passpercentage
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
    */

}