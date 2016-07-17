var chai = require('chai');
var lists = require('../../dist/helpers/functions');

var assert = chai.assert;
var expect = chai.expect;

describe('lists', function () {

  describe('multiapply()', function () {
    it('calls the same function on all objects in an array', function () {
      var result = '';
      var source = [
        { execute() { result += 'Jane' } },
        { execute() { result += ' ' } },
        { execute() { result += 'Smith' } },
      ];

      lists.multiapply(source, 'execute');

      assert.equal('Jane Smith', result);
    });
  });  

});