const chai = require('chai');
const assert = chai.assert;
const index = require('../index.js')();

describe('Gladys-timer index', function () {
  it('Timer is a function', function (done) {
    assert.isFunction(index.timer.deviceTimer, 'Should have been a function');
    done();
  });
});