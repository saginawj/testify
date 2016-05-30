var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

var docClient = new AWS.DynamoDB.DocumentClient();

var tableName = 'testResultsTable';
var id = '1010' //to replace

var params = {
    TableName : tableName,
    Key: {
        id: id
    }
};

docClient.get(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
});
