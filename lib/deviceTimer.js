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
  const { consumer } = params;
  return gladys.deviceType.getById({ id: consumer.deviceTypeId })
    .then((deviceState) => {
      if (deviceState.lastValue !== consumer.activeValue) {
        return gladys.deviceType.exec({ devicetype: consumer.deviceTypeId, value: consumer.activeValue })
          .then(() => {
            return storeTimer(params, true);
          });
      } else {
        return storeTimer(params, false);
      }
    });
}

function storeTimer(params, addTimer) {
  const key = params.consumer.deviceTypeId;

  if (timeoutMap.has(key)) {
    const timer = timeoutMap.get(key);
    timer.clearTimeout();
    addTimer = true;
  }

  if (addTimer) {
    timeoutMap.set(key, setTimeout(checkTimerConditions, params.timeout, params));
  }

  return Promise.resolve(params);
}

function checkTimerConditions(params) {
  const sqlParams = [params.provider.deviceTypeId, params.provider.activeValue];
  return gladys.utils.sql('SELECT * FROM devicestate WHERE devicetype = ? and value = ? ORDER BY datetime DESC LIMIT 1;', [sqlParams])
    .then((deviceStates) => {
      if (deviceStates.length === 1 && new Date().getTime() - deviceStates[0].datetime.getTime() > duree) {
        const { consumer } = params;
        timeoutMap.delete(consumer.deviceTypeId);
        return gladys.deviceType.exec({ devicetype: consumer.deviceTypeId, value: consumer.inactiveValue });
      } else {
        return Promise.resolve('Nothing to do');
      }
    });
}