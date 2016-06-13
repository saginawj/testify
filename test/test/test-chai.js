var assert = require('chai').assert;  //use for TDD, not BDD
var expect = require('chai').expect;	//use for BDD
var testCase = require('mocha').describe;
var expected;
var current;

before(function(){
  expectedString = "helloworld";
})

describe('**TDD Tests with Assert**', function(){
  beforeEach(function(){
   current = 'helloworld';
  })
  
  it('should return a string', function(){
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
  });
})

