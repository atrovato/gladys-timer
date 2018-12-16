const chai = require('chai');
const assert = chai.assert;
const checkParameters = require('../../lib/checkParameters.js');

describe('Gladys-timer check parameters', function () {
  it('Parameters are mandatory', function (done) {
    checkParameters()
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer parameters are mandatory');
        done();
      });
  });

  it('Timer parameters are mandatory', function (done) {
    checkParameters({})
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer \'consumer.timeout\' parameter is missing');
        done();
      });
  });

  it('Provider parameters are mandatory', function (done) {
    checkParameters({ timeout: 2000 })
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer \'provider\' parameter is missing');
        done();
      });
  });

  it('Provider deviceTypeId parameter is mandatory', function (done) {
    checkParameters({ timeout: 2000, provider: {} })
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer \'provider.deviceTypeId\' parameter is missing');
        done();
      });
  });

  it('Provider activeValue parameter is mandatory', function (done) {
    checkParameters({ timeout: 2000, provider: { deviceTypeId: 1 } })
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer \'provider.activeValue\' parameter is missing');
        done();
      });
  });

  it('Consumer parameters are mandatory', function (done) {
    checkParameters({ timeout: 2000, provider: { deviceTypeId: 1, activeValue: 0 } })
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer \'consumer\' parameter is missing');
        done();
      });
  });

  it('Consumer deviceTypeId parameters are mandatory', function (done) {
    checkParameters({ timeout: 2000, provider: { deviceTypeId: 1, activeValue: 0 }, consumer: {} })
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer \'consumer.deviceTypeId\' parameter is missing');
        done();
      });
  });

  it('Consumer activeValue parameters are mandatory', function (done) {
    checkParameters({ timeout: 2000, provider: { deviceTypeId: 1, activeValue: 0 }, consumer: { deviceTypeId: 1 } })
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.isOk(err, 'Timer \'consumer.activeValue\' parameter is missing');
        done();
      });
  });

  it('Consumer inactiveValue parameters are mandatory', function (done) {
    checkParameters({ timeout: 2000, provider: { deviceTypeId: 1, activeValue: 0 }, consumer: { deviceTypeId: 1, activeValue: 0 } })
      .then(() => {
        done('Should have fail');
      }).catch((err) => {
        assert.equal(err, 'Timer \'consumer.inactiveValue\' parameter is missing');
        done();
      });
  });

  it('Parameters are OK', function (done) {
    const params = { timeout: 2000, provider: { deviceTypeId: 1, activeValue: 0 }, consumer: { deviceTypeId: 1, activeValue: 0, inactiveValue: 1 } };
    checkParameters(params)
      .then((res) => {
        assert.deepEqual(res, params);
        done();
      }).catch((err) => {
        done(err);
      });
  });
});