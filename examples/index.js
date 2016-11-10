import Zombee from '../src';
import flog from '../src/flog';

flog.tags('foo')
flog.debug('Test debug');
flog.info('Test info');
flog.warn('Test warn');
flog.error('Test error');

new Zombee().harvest('https://raw.githubusercontent.com/katopz/zombee/master/README.md')