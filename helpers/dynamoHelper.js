var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

var docClient = new AWS.DynamoDB.DocumentClient();
var tableName = 'testResultsTable';
var params = {
    TableName : tableName
};

//Example of a nested-get
docClient.scan(params, function dynamoScanResponse(err, data) {
    if (err) console.log(err);
    else {
        var count = data.Items.length;
        var items = data.Items;
        var date = data.Items[count -1].date;
        var id = data.Items[count-1].id;

        //console.log(data);
        console.log("Date: ", date);
        console.log("ID: ", id);


        //PUTTING THE GET CODE HERE
        params = {};
        params.TableName = "testResultsTable";
        params.Key = {id : id};


        docClient.get(params, function(err, data) {
            if (err) {
                console.log("GetItem Error");
                console.log(err)
                //speechOutput = "Sorry, I had trouble pulling the resuilts.  You'll need to check the old fashion way.  With your eyes";
                //response.tellWithCard(speechOutput, "Testify", speechOutput);
            }
            else {
                console.log("Dynamo Get Successful.  Data Below");
                console.log(data);

                //var passPercentage  = data.Item.passpercentage;
                //var date            = data.Item.date;
                //var harness         = data.Item.harness;

                //speechOutput = "Here's your test resuilts:   On " + date  + ", the " + harness + " harness had a pass percentage of " + passPercentage;
                //console.log("SPEECH OUTPUT:  " + speechOutput);
                //response.tellWithCard(speechOutput, "Testify", speechOutput);
            }
        });

    }
});





/*
//PUT COMMAND

 var params = {
 TableName : tableName,
 Item: {
 id: '1061',
 date: 'May31',
 harness: 'regression',
 passpercentage: '81'
 }
 };

docClient.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
});
*/

/*GET
var paramsGet = {
    TableName : 'testResultsTable',
    Key: {
        id: '1010'
    }
};

//GET
docClient.get(paramsGet, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
});
*/

console.log("EXECUTION COMPLETE");




