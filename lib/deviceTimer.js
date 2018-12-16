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
            return timer.registerTimer(params, checkTimerConditions, true);
          });
      } else {
        return timer.registerTimer(params, checkTimerConditions, false);
      }
    });
}

function checkTimerConditions(params) {
  const sqlParams = [params.provider.deviceTypeId, params.provider.activeValue];
  return gladys.utils.sql('SELECT * FROM devicestate WHERE devicetype = ? and value = ? ORDER BY datetime DESC LIMIT 1;', [sqlParams])
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