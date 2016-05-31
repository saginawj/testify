var request = require('request');

function getQuote() {
    var quote;

    request('http://ron-swanson-quotes.herokuapp.com/v2/quotes', function(error, response, body) {
        quote = body;
    });

    return quote;
}

function main() {
    var quote = getQuote();
    console.log(quote);
}

main();
