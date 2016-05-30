var AWS = require("aws-sdk");
var DOC = require("dynamodb-doc");

AWS.config.update({region: "us-east-1"});

var docClient = new DOC.DynamoDB();

params = {};
params.TableName = "testResultsTable";
params.Key = {id : "1010"};
theAnswer = "";

console.log("Before GetItem");

docClient.getItem(params, function(err, data) {
    if (err) {
        console.log(err); // an error occurred
    }
    else {
        console.log("The Data:  ", data); // successful response
        theAnswer = data.Item.passpercentage;
        console.log("The Answer:  :", theAnswer);
    }
});

