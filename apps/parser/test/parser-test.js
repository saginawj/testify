var mocha = require('mocha');
var expect = require('chai').expect;

var parser = require('../src/parser.js');

describe('**Parser Class**', function(){

  it('should return a default test', function(){
	var current = 'hi';
    expect(current).to.equal('hi');
  });

  it('should return a file', function(){
	var json = parser.jsonParse('../data/event.json');
	expect(json).is.not.null;
  });
})



