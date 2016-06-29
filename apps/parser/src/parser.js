var fs = require('fs');


exports.jsonParse = function () {

	var contents = fs.readFileSync('../data/event.json');

	var json = JSON.parse(contents);

      console.log(json);
    }
