var assert = require('chai').assert;  //use for TDD, not BDD
var expect = require('chai').expect;	//use for BDD
var testCase = require('mocha').describe;
var fs = require("fs");

var tags = require('../lib/tags.js');
var search = require('../lib/search.js');

before(function(){
  expectedString = "helloworld";
})

describe('**TDD Tests with Assert**', function(){

  it('should return a string', function(){
	var current = 'helloworld';
    assert.equal(current, expectedString, "strings not the same");
  });
})

describe('**BDD Tests with Expect**', function(){
  beforeEach(function(){
   current = 1;
  })
  describe('Basics', function(){

	  it('should return a number', function(){
		  	expect(1).to.equal(1);
	  });
	  it('should equal a string', function(){
		    expect(expectedString).to.equal("helloworld");
	  });
	  it('should check binary to true', function(){
		    expect(true).to.be.true;
	  });
	  it('should check binary to false', function(){
		    expect(false).to.not.be.true;
	  });
	  it('should check binary', function(){
		    expect(true).to.not.be.false;
	  });
	  it('verify jenkins integration', function(){
		    expect(true).to.not.be.false;
	  });
  });
})

describe("Tags", function(){

	describe("#concat()", function(){

	       it("should concatenate two strings", function(){
	    	   var one = "hello";
		       var two = "world";
		       var three = "three";
		       var four = "four";
		       var five = "five";
	           var result = tags.concat(one, two);

	           expect(result).to.equal("hello world");
	       });
	   });
});

describe("Search", function(){
	   describe("#scan()", function(){
	       before(function() {
	           if (!fs.existsSync(".test_files")) {
	               fs.mkdirSync(".test_files");
	               fs.writeFileSync(".test_files/a", "");
	               fs.writeFileSync(".test_files/b", "");
	               fs.mkdirSync(".test_files/dir");
	               fs.writeFileSync(".test_files/dir/c", "");
	               fs.mkdirSync(".test_files/dir2");
	               fs.writeFileSync(".test_files/dir2/d", "");
	           }
	       });

	       after(function() {
	           fs.unlinkSync(".test_files/dir/c");
	           fs.rmdirSync(".test_files/dir");
	           fs.unlinkSync(".test_files/dir2/d");
	           fs.rmdirSync(".test_files/dir2");
	           fs.unlinkSync(".test_files/a");
	           fs.unlinkSync(".test_files/b");
	           fs.rmdirSync(".test_files");
	       });
	   });
	});

