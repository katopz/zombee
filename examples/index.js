import Zombee from '../src';
import debug from '../src/debug';

debug.debug('Test debug');
debug.info('Test info');
debug.warn('Test warn');
debug.error('Test error');

new Zombee().harvest('https://raw.githubusercontent.com/katopz/zombee/master/README.md')