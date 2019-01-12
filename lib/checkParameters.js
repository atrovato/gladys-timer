const Promise = require('bluebird');
const operators = ['<=', '<', '=', '>', '>='];
/**
 * Checks expected parameters.
 */
module.exports = function (params) {
  if (!params) {
    return Promise.reject('Timer parameters are mandatory');
  }

  return checkTimerParameters(params)
    .then(() => {
      return checkConditionParameters(params);
    }).then(() => {
      return checkProviderParameters(params);
    }).then(() => {
      return checkConsumerParameters(params);
    });
};

function checkTimerParameters(params) {
  if (!params.hasOwnProperty('timeout')) {
    return Promise.reject('Timer \'consumer.timeout\' parameter is missing');
  } else {
    return Promise.resolve(params);
  }
}

function checkConditionParameters(params) {
  if (params.hasOwnProperty('condition')) {
    if (!params.condition.hasOwnProperty('deviceTypeId')) {
      return Promise.reject('Timer \'condition.deviceTypeId\' parameter is missing');
    } else if (!params.condition.hasOwnProperty('activeValue')) {
      return Promise.reject('Timer \'condition.activeValue\' parameter is missing');
    } else if (!params.condition.hasOwnProperty('operator')) {
      params.condition.operator = '=';
    } else if (!operators.includes(params.condition.operator)) {
      return Promise.reject('Timer \'condition.operator\' parameter is invalid');
    }
  }

  return Promise.resolve(params);
}

function checkProviderParameters(params) {
  if (!params.hasOwnProperty('provider')) {
    return Promise.reject('Timer \'provider\' parameter is missing');
  } else if (!params.provider.hasOwnProperty('deviceTypeId')) {
    return Promise.reject('Timer \'provider.deviceTypeId\' parameter is missing');
  } else if (!params.provider.hasOwnProperty('activeValue')) {
    return Promise.reject('Timer \'provider.activeValue\' parameter is missing');
  } else if (!params.provider.hasOwnProperty('operator')) {
    params.provider.operator = '=';
  } else if (!operators.includes(params.provider.operator)) {
    return Promise.reject('Timer \'provider.operator\' parameter is invalid');
  }

  return Promise.resolve(params);
}

function checkConsumerParameters(params) {
  if (!params.hasOwnProperty('consumer')) {
    return Promise.reject('Timer \'consumer\' parameter is missing');
  } else if (!params.consumer.hasOwnProperty('deviceTypeId')) {
    return Promise.reject('Timer \'consumer.deviceTypeId\' parameter is missing');
  } else if (!params.consumer.hasOwnProperty('activeValue')) {
    return Promise.reject('Timer \'consumer.activeValue\' parameter is missing');
  } else if (!params.consumer.hasOwnProperty('inactiveValue')) {
    return Promise.reject('Timer \'consumer.inactiveValue\' parameter is missing');
  } else {
    return Promise.resolve(params);
  }
}