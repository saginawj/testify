var dateFormat = require('dateformat');
var _ = require('lodash');

var now = new Date();

now = dateFormat(now, "dddd, mmmm dS, h:MM TT");

console.log(now);


var passpercent = _.random(100);

console.log(passpercent);