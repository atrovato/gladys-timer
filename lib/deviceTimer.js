const Promise = require('bluebird');
const checkParameters = require('./checkParameters.js');
const timer = require('./timer.js');

/**
 * Timer script for Gladys.
 * 
 * @param {Object} params Timer parameters.
 */
module.exports = function (params) {
  return checkParameters(params)
    .then(() => {
      return checkCondition(params);
    }).then(() => {
      return checkLastState(params);
    }).catch(() => {
      return timer.registerTimer(params, checkTimerConditions, false);
    });
};

function checkLastState(params) {
  const { consumer } = params;
  if (params.consumer.hasOwnProperty('checkDeviceState') && !params.consumer.checkDeviceState) {
    return return timer.registerTimer(params, checkTimerConditions, true);
  } else {
    return gladys.deviceType.getById({ id: consumer.deviceTypeId })
      .then((deviceState) => {
        if (deviceState.lastValue !== consumer.activeValue) {
          return gladys.deviceType.exec({ devicetype: consumer.deviceTypeId, value: consumer.activeValue })
            .then(() => {
              return timer.registerTimer(params, checkTimerConditions, true);
            });
        } else {
          return Promise.reject(params);
        }
      });
  }
}

function checkCondition(params) {
  if (params.hasOwnProperty('condition')) {
    const sqlParams = [params.condition.deviceTypeId];
    return gladys.utils.sql('SELECT * FROM devicestate WHERE devicetype = ? ORDER BY datetime DESC LIMIT 1;', sqlParams)
      .then((deviceStates) => {
        if (deviceStates.length === 1 && checkValue(params.condition, deviceStates[0])) {
          return Promise.resolve(params);
        } else {
          return Promise.reject(params);
        }
      });
  } else {
    return Promise.resolve(params);
  }
}

function checkValue(condition, deviceState) {
  var currentValue = deviceState.value;

  switch (condition.operator) {
  case '<=':
    return condition.activeValue <= currentValue;
  case '<':
    return condition.activeValue < currentValue;
  case '=':
    return condition.activeValue == currentValue;
  case '>':
    return condition.activeValue > currentValue;
  case '>=':
    return condition.activeValue >= currentValue;
  }
}

function checkTimerConditions(params) {
  const sqlParams = [params.provider.deviceTypeId, params.provider.activeValue];
  return gladys.utils.sql('SELECT * FROM devicestate WHERE devicetype = ? and value ' + params.provider.operator + ' ? ORDER BY datetime DESC LIMIT 1;', sqlParams)
    .then((deviceStates) => {
      if (deviceStates.length === 1 && new Date().getTime() - deviceStates[0].datetime.getTime() > params.timeout) {
        const { consumer } = params;
        timer.unregisterTimer(params);
        return gladys.deviceType.exec({ devicetype: consumer.deviceTypeId, value: consumer.inactiveValue });
      } else {
        return Promise.resolve('Nothing to do');
      }
    });
}
