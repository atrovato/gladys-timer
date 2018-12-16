const Promise = require('bluebird');
const timers = new Map();

module.exports = {
  /**
   * Register and store the timer.
   * @param {Object} params overall params.
   * @param {Function} method method to call after timeout.
   * @param {Boolean} addTimer set timer only if already exists.
   */
  registerTimer: function (params, method, addTimer) {
    const key = params.consumer.deviceTypeId;
    const timeout = params.timeout;

    if (timers.has(key)) {
      const timer = timers.get(key);
      clearTimeout(timer);
      addTimer = true;
    }

    if (addTimer) {
      timers.set(key, setTimeout(method, timeout, params));
    }

    return Promise.resolve(params);
  },
  /**
   * Unregister and removes the timer.
   * @param {int} key the device id related to the timer. 
   */
  unregisterTimer: function (params) {
    const key = params.consumer.deviceTypeId;
    if (timers.has(key)) {
      clearTimeout(timers.get(key));
      timers.delete(key);
    }

    return Promise.resolve(key);
  },
  /**
   * Retreive all stored times.
   */
  getTimers: function () {
    const obj = {};
    timers.forEach(function (value, key) {
      obj[key] = value;
    });
    return obj;
  }
};