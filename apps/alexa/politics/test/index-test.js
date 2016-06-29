var expect = require('chai').expect;	//use for BDD

var history = require('../src/index.js');


before(function(){
  var expectedString = "helloworld";
})

describe("**Washington Insider Events**", function(){

	describe("Basic Functions", function(){
	       it("return true", function(){
	    	   expect(true).to.equal(true);
	       });
	       it("return false", function(){
	    	   expect(false).to.equal(false);
	       });
	       it("add two numbers", function(){
	       		var one = 1;
	       		var two = 2;
	    	   expect(one + two).to.equal(3);
	       });
	   });
});