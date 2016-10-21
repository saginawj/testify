var fs = require('fs');


exports.jsonParse = function (file) {

	var contents = fs.readFileSync(file);

	var json = JSON.parse(contents);

      console.log(json);
    }
