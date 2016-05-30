var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
var codepipeline = new AWS.CodePipeline();

var params = {
    name: "testify-pipeline"
};
codepipeline.startPipelineExecution(params, function(err, data) {
    if (err){
        console.log("FAILED");
        console.log(err, err.stack);
    } 
    else{
        console.log("SUCCESS");
        console.log(data);
    }
});