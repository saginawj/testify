var assert = require('chai').assert;
var expected;
var current;

before(function(){
  expected = "helloworld";
})

describe('Strings', function(){
  beforeEach(function(){
   current = 'helloworld';
  })
  
  it('should return a string', function(){
    assert.equal(current, expected, "strings not the same");
  });
})