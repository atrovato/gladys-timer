const Promise = require('bluebird');
const checkParameters = require('./checkParameters.js');
const timeoutMap = new Map();

/**
 * Timer script for Gladys.
 * 
 * @param {Object} params Timer parameters.
 */
module.exports = function (params) {
  return checkParameters(params)
    .then(() => {
      return checkLastState(params);
    });
};

function checkLastState(params) {
  const { expected } = params;
  return gladys.deviceType.getById({ id: expected.deviceTypeId })
    .then((deviceState) => {
      if (deviceState.lastValue !== expected.activeValue) {
        return gladys.deviceType.exec({ devicetype: expected.deviceTypeId, value: expected.activeValue })
          .then(() => {
            return storeTimer(params);
          });
      } else {
        return storeTimer(params);
      }
    });
}

function storeTimer(params) {
  const key = params.expected.deviceTypeId;

  if (timeoutMap.has(key)) {
    const timer = timeoutMap.get(key);
    timer.clearTimeout();
  }

  timeoutMap.set(key, setTimeout(checkTimerConditions, params.timeout, params));

  return Promise.resolve(params);
}

function checkTimerConditions(params) {
  const sqlParams = [params.provider.deviceTypeId, params.provider.activeValue];
  return gladys.utils.sql('SELECT * FROM devicestate WHERE devicetype = ? and value = ? ORDER BY datetime DESC LIMIT 1;', [sqlParams])
    .then((deviceStates) => {
      if (deviceStates.length === 1 && new Date().getTime() - deviceStates[0].datetime.getTime() > duree) {
        const { expected } = params;
        return gladys.deviceType.exec({ devicetype: expected.deviceTypeId, value: expected.inactiveValue });
      } else {
        return Promise.resolve('Nothing to do');
      }
    });
}