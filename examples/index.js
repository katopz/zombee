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