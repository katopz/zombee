import Zombee from '../src';
import flog from '../src/flog';

flog.tags('foo')
flog.debug('Test debug');
flog.info('Test info');
flog.warn('Test warn');
flog.error('Test error');

const uri = 'https://raw.githubusercontent.com/katopz/zombee/master/README.md'
new Zombee()
  .on(Zombee.FETCH, flog.begin)
  .on(Zombee.ERROR, flog.error)
  .on(Zombee.FAILED, flog.warn)
  .on(Zombee.SUCCEED, (response) => {
    flog.info(Object.assign({},
      flog.end(uri),
      { status: response.status }
    ))
  })
  .every(3 * Zombee.SEC)
  .harvest(uri)