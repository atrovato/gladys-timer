const Promise = require('bluebird');
/**
 * Checks expected parameters.
 */
module.exports = function (params) {
  if (!params) {
    return Promise.reject('Timer parameters are mandatory');
  }

  return checkTimerParameters(params)
    .then(() => {
      return checkProviderParameters(params);
    }).then(() => {
      return checkExpectedParameters(params);
    });
};

function checkTimerParameters(params) {
  if (!params.hasOwnProperty('timeout')) {
    return Promise.reject('Timer \'expected.timeout\' parameter is missing');
  } else {
    return Promise.resolve(params);
  }
}

function checkProviderParameters(params) {
  if (!params.hasOwnProperty('provider')) {
    return Promise.reject('Timer \'provider\' parameter is missing');
  } else if (!params.provider.hasOwnProperty('deviceTypeId')) {
    return Promise.reject('Timer \'provider.deviceTypeId\' parameter is missing');
  } else if (!params.provider.hasOwnProperty('activeValue')) {
    return Promise.reject('Timer \'provider.activeValue\' parameter is missing');
  } else {
    return Promise.resolve(params);
  }
}

function checkExpectedParameters(params) {
  if (!params.hasOwnProperty('expected')) {
    return Promise.reject('Timer \'expected\' parameter is missing');
  } else if (!params.expected.hasOwnProperty('deviceTypeId')) {
    return Promise.reject('Timer \'expected.deviceTypeId\' parameter is missing');
  } else if (!params.expected.hasOwnProperty('activeValue')) {
    return Promise.reject('Timer \'expected.activeValue\' parameter is missing');
  } else if (!params.expected.hasOwnProperty('inactiveValue')) {
    return Promise.reject('Timer \'expected.inactiveValue\' parameter is missing');
  } else {
    return Promise.resolve(params);
  }
}