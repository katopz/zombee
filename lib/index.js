'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _events = require('events');var _events2 = _interopRequireDefault(_events);
var _fetch2 = require('./fetch');var _fetch3 = _interopRequireDefault(_fetch2);
var _log = require('./log');var _log2 = _interopRequireDefault(_log);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var

Zombee = function (_EventEmitter) {_inherits(Zombee, _EventEmitter);

  /*
                                                                     static FAILED = 'failed'
                                                                     static ERROR = 'error'
                                                                     static SUCCEED = 'succeed'
                                                                       static ONE_MINUTE = 1000 * 60
                                                                     static FIVE_MINUTE = 1000 * 60
                                                                     */


  function Zombee(uri, interval) {_classCallCheck(this, Zombee);var _this = _possibleConstructorReturn(this, (Zombee.__proto__ || Object.getPrototypeOf(Zombee)).call(this));


    _this._watchForAnyError();
    _this._watchForExit();

    _this._fetch(uri);
    interval && _this._repeat(uri, interval);return _this;
  }_createClass(Zombee, [{ key: '_fetch', value: function _fetch(

    uri) {var _this2 = this;
      try {(function () {
          // Perf
          var now = function now() {return +new Date();};
          var begin = now();

          // Job
          (0, _fetch3.default)(uri).
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
              _this2.emit('failed', response);
            }

            // succeed
            _this2.emit('succeed', response);
          }).catch(function (err) {
            // error
            _log2.default.error(err);
            _this2.emit('error', err);
          });})();
      } catch (err) {
        console.error(err); // eslint-disable-line
      }
    } }, { key: '_repeat', value: function _repeat(

    uri, interval) {
      this.bee = setInterval(
      this._fetch,
      interval,
      uri);

    } }, { key: '_watchForAnyError', value: function _watchForAnyError()

    {
      process.on('uncaughtException', function (err) {
        console.error(err); // eslint-disable-line
      });
    } }, { key: '_watchForExit', value: function _watchForExit()

    {var _this3 = this;
      // Graceful Shutdown
      process.on('SIGTERM', function () {
        try {
          // self
          _this3.dispose();

          // log
          _log2.default.info('EXIT');
          _log2.default.dispose();
        } catch (err) {
          console.error(err); // eslint-disable-line
        }

        process.exit(0);
      });
    } }, { key: 'dispose', value: function dispose()

    {
      this.bee && clearInterval(this.bee);
    } }]);return Zombee;}(_events2.default);exports.default = Zombee;