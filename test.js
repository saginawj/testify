// Read Synchrously
var fs = require("fs");
var content = fs.readFileSync("configdata.json");
var json = JSON.parse(content);
var iftttkey = json.iftttkey;
console.log(iftttkey);