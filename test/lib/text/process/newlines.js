var assert = require("assert")
var new_lines = require("../../../../lib/text/process/newlines");

describe('Process :: new lines', function(){
  it('should replace <br>\s with new lines', function(){
    assert.equal(new_lines("<br>"), "\n");
  })

  it('should replace <br />\s with new lines', function(){
    assert.equal(new_lines("<br />"), "\n");
  })

  it('should replace <br style="display: none" />\s with new lines', function(){
    assert.equal(new_lines("<br style=\"display: none\" />"), "\n");
  })

  it('should not use greedy replacement', function(){
    assert.equal(new_lines("<br>abc<br>"), "\nabc\n");
  })

  it('should normalize the mixture of \\r and \\n', function(){
    assert.equal(new_lines("\rabc\r\ndef\n"), "\nabc\ndef\n");
  })

})
