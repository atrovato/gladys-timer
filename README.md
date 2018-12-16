# gladys-timer
Scripts to add some timer logics to Gladys.

## API
All defined functions are promises and can be used as :
```javascript
gladys.modules.timer.deviceTimer({ ... params })
  .then(() => ... something else ...) 
  .catch(() => ... something more ...); 
```

### Device Timer
This function allows you to check when a value of a device if reached, and changes temporary the value of another device.

```javascript
gladys.modules.timer.deviceTimer({ ... params });
```

With 'params' is an object as :

| Property        | Description           | Example  |
| --- | --- | --- |
| timeout         | Time to check device state in milliseconds | 2000 (for 2s) |
| provider        | Description of the input device            | { deviceTypeId: 1, activateValue: 1 } |
| consumer        | Description of the output device           | { deviceTypeId: 2, activateValue: 1, inactivateValue : 0 } |

Example : when the presence sensor (id=1) detects activity, the light (id=2) should be ON only for 2 minutes after last activity

```javascript
gladys.modules.timer.deviceTimer({
  // time, duration 
  timeout: 120000,
  // device to activate timer
  provider: {
    deviceTypeId: 1, // presence sensor ID
    activateValue: 1 // presence value for activity
  },
  // device to manage
  consumer: {
    deviceTypeId: 2, // light ID
    activateValue: 1, // switch light ON
    inactivateValue: 0 // switch light OFF
  }
 });
```