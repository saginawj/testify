//TODO: replace boiler-plate SNS code with code that puts message into Dynamo

'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('EVENT:  \n', JSON.stringify(event, null, 2));
    console.log('passpercentage:  ', event.passpercentage)
    console.log('CONTEXT:  \n', context);
    //const message = event.Records[0].Sns.Message;
    //console.log('From SNS:', message);
    //callback(null, message);
};