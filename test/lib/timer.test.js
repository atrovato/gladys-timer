const chai = require('chai');
const assert = chai.assert;
const timer = require('../../lib/timer.js');
const sinon = require('sinon');

describe('Gladys-timer code', function () {
  var clock;
  beforeEach(function () {
    clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    Object.keys(timer.getTimers()).map(k => timer.unregisterTimer({ consumer: { deviceTypeId: parseInt(k) } }));
    clock.restore();
  });

  it('Register and store timer', function (done) {
    var status = false;
    const params = { timeout: 100, consumer: { deviceTypeId: 102 } };
    const callback = function () {
      status = true;
    };

    timer.registerTimer(params, callback, true)
      .then(() => {
        assert.sameMembers(['102'], Object.keys(timer.getTimers()));
        assert.isNotOk(status);
        clock.tick(150);
        assert.isOk(status);
        done();
      }).catch((err) => {
        done(err);
      });
  });

  it('Register and not store timer', function (done) {
    var status = false;
    const params = { timeout: 100, consumer: { deviceTypeId: 102 } };
    const callback = function () {
      status = true;
    };

    timer.registerTimer(params, callback, false)
      .then(() => {
        assert.sameMembers([], Object.keys(timer.getTimers()));
        assert.isNotOk(status);
        clock.tick(150);
        assert.isNotOk(status);
        done();
      }).catch((err) => {
        done(err);
      });
  });

  it('Register and not store timer but already exists', function (done) {
    var status = false;
    const params = { timeout: 1000, consumer: { deviceTypeId: 102 } };
    const callback = function () {
      status = true;
    };

    timer.registerTimer(params, callback, true)
      .then(() => {
        clock.tick(750);
        return timer.registerTimer(params, callback, false);
      }).then(() => {
        assert.sameMembers(['102'], Object.keys(timer.getTimers()));
        clock.tick(300);
        assert.isNotOk(status);
        clock.tick(1000);
        assert.isOk(status);
        done();
      }).catch((err) => {
        done(err);
      });
  });

  it('Unregister timer that already exists', function (done) {
    var status = false;
    const params = { timeout: 1000, consumer: { deviceTypeId: 102 } };
    const callback = function () {
      status = true;
    };

    timer.registerTimer(params, callback, true)
      .then(() => {
        return timer.unregisterTimer(params);
      }).then(() => {
        assert.sameMembers([], Object.keys(timer.getTimers()));
        clock.tick(3000);
        assert.isNotOk(status);
        clock.tick(1000);
        assert.isNotOk(status);
        done();
      }).catch((err) => {
        done(err);
      });
  });

  it('Unregister timer that not already exists', function (done) {
    var status = false;
    const params = { timeout: 1000, consumer: { deviceTypeId: 102 } };
    const callback = function () {
      status = true;
    };

    timer.registerTimer(params, callback, true)
      .then(() => {
        return timer.unregisterTimer({ timeout: 1000, consumer: { deviceTypeId: 103 } });
      }).then(() => {
        assert.sameMembers(['102'], Object.keys(timer.getTimers()));
        assert.isNotOk(status);
        clock.tick(1000);
        assert.isOk(status);
        done();
      }).catch((err) => {
        done(err);
      });
  });
});