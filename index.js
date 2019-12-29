const deviceTimer = require('./lib/deviceTimer.js');
const timer = require('./lib/deviceTimer.js');

module.exports = function (sails) {
  return {
    deviceTimer: deviceTimer,
    timerManager: timer
  };
};
