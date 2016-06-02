var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

var docClient = new AWS.DynamoDB.DocumentClient();

var tableName = 'testResultsTable';
//var id = '1010' //to replace

var params = {
    TableName : tableName,
    Item: {
        id: '1061',
        date: 'May31',
        harness: 'regression',
        passpercentage: '81'
    }
};

/*
docClient.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
});
*/

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

console.log("EXECUTION COMPLETE");




