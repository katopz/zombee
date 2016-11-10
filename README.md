# zombee
🐝 Zombee will keep interval fetch target uri until it die

## How to use.
```js
// Will fetch every 3 seconds and log every events to file named as current date.
import Zombee from '../src';
import firelog from '../src/firelog';

firelog.tags('foo')
firelog.debug('Test debug');
firelog.info('Test info');
firelog.warn('Test warn');
firelog.error('Test error');

const uri = 'https://raw.githubusercontent.com/katopz/zombee/master/README.md'
new Zombee()
  .on(Zombee.FETCH, firelog.begin)
  .on(Zombee.ERROR, firelog.error)
  .on(Zombee.FAILED, firelog.warn)
  .on(Zombee.SUCCEED, (response) => firelog.log(
    Object.assign({}, firelog.end(uri), { status: response.status })
  ))
  .every(3 * Zombee.SEC)
  .harvest(uri)
```

## TODO - Features
- [ ] Accept uri as array
- [x] Emit event
- [x] Optional log
- [ ] Add how to build
- [ ] Add how to dev

## TODO - Test
### Log
- [x] Expect new YYYY-MM-DD log file use each day.
- [x] Expect new YYYY-MM-DD log file use each month.
- [x] Expect new YYYY-MM-DD log file use each year.
- [x] Expect new log folder create if not exist with minimal permission.
- [x] Expect error if not allowed path used.
- [x] Expect error if not allowed name used.
- [x] Expect info print to file.
- [x] Expect warn print to file.
- [x] Expect error print to file.

### Fetch
- [x] Expect fetch done as interval set.
- [x] Expect fetch response to be same URI.
- [ ] Expect fetch options to be use.

### Features v0.6.0
- [ ] Use `require` instead of `import`.
- [ ] Separated `firelog`.
- [ ] Use observable.

### Features v1.0.0
- [ ] Add browser log support.
- [ ] Add browser log persistance support.
- [ ] Add browser unit test.
