'use strict';var _fetch = require('./fetch');var _fetch2 = _interopRequireDefault(_fetch);
var _log = require('./log');var _log2 = _interopRequireDefault(_log);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// Input
var uri = 'https://raw.githubusercontent.com/katopz/vscode-debug-nodejs-es6/master/README.md';
var interval = 1000 * 60;

// TODO : pub/sub with alerter?
var resolve = console.log;
var reject = console.log;
var error = console.log;

// Tasks
var tasks = function tasks(_ref) {var uri = _ref.uri,resolve = _ref.resolve,reject = _ref.reject,error = _ref.error;
  try {(function () {
      // Perf
      var now = function now() {return +new Date();};
      var begin = now();

      // Job
      (0, _fetch2.default)(uri).
      then(function (response) {
        // Perf
        var end = now();
        _log2.default.info({
          begin: begin,
          end: end,
          latency: end - begin,
          status: response.status });


        // failure
        if (response.status >= 400) {
          _log2.default.error(response.statusText);
          reject && reject(response);
        }

        // succeed
        resolve && resolve(response);
      }).catch(function (err) {
        // error
        _log2.default.error(err);
        error && error(err);
      });})();
  } catch (err) {
    console.error(err);
  }
};

// Repeat
var bee = setInterval(
tasks,
interval,
{
  uri: uri,
  resolve: resolve,
  reject: reject,
  error: error });



// Graceful Shutdown
process.on('SIGTERM', function () {
  try {
    clearInterval(bee);
    _log2.default.info('EXIT');
    _log2.default.dispose();
  } catch (err) {
    console.error(err);
  }

  process.exit(0);
});