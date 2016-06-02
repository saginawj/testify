var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

var docClient = new AWS.DynamoDB.DocumentClient();

var tableName = 'testResultsTable';
//var id = '1010' //to replace



var params = {
    TableName : tableName
};


docClient.scan(params, function(err, data) {
    if (err) console.log(err);
    else {
    var count = data.Items.length;
    var items = data.Items;
    var date = data.Items[count -1].date;

        console.log(data);
        console.log(date);
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




