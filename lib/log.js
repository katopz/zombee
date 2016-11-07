'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.defaultOptions = undefined;var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

// Private
var INFO = '*';
var WARNING = '#';
var ERROR = '!';

// Default
var defaultOptions = exports.defaultOptions = {
  folder: 'logs',
  name: 'zombee_',
  ext: 'log' };


// Allow only word
var _isAllowedPath = function _isAllowedPath(uri) {return uri.match(/[^\w]/g) ? false : true;};

// Ensure folder exist
var _ensureFolderExist = function _ensureFolderExist(folder) {return _fs2.default.existsSync(folder) || _fs2.default.mkdirSync(folder);};

// Get current YYY-MM-DD
var _getCurrentYMD = function _getCurrentYMD() {return new Date().toISOString().split('T')[0];};

// Do print to console
var _print = function _print(type, raw) {
  try {
    // Input
    var text = raw instanceof String ? raw : JSON.stringify(raw);
    var at = new Date();

    // Not config yet?
    if (!log.options || _getCurrentYMD() !== log.options.stamp) {
      log.config(log.options || defaultOptions);
    }

    // Log
    log.options.console && log.options.console.log([
    process.pid,
    +at,
    at.toUTCString(),
    type,
    text].
    join(' | '));
  } catch (err) {
    console.error(err);
  }
};var

log = function () {function log() {_classCallCheck(this, log);}_createClass(log, null, [{ key: 'config', value: function config(
    customOptions) {
      try {

        // Options
        log.options = Object.assign({}, defaultOptions, customOptions);

        // Cursor
        log.options.stamp = _getCurrentYMD();

        // Writer
        var _log$options = log.options,folder = _log$options.folder,name = _log$options.name,ext = _log$options.ext,stamp = _log$options.stamp;

        // Filter bad path
        if (!_isAllowedPath(folder) || !_isAllowedPath(name)) {
          throw new Error('Absolute path not allow.');
        }

        // Ensure folder exist
        _ensureFolderExist(folder);

        // Output
        var output = _fs2.default.createWriteStream(folder + '/' + name + stamp + '.' + ext, { flags: 'a' });
        log.options.output = output;

        // Console -> Output
        log.options.console = new console.Console(output, output);
      } catch (err) {
        console.error(err);
      }

      return log;
    } }, { key: 'info', value: function info(

    raw) {
      _print(INFO, raw);
      return log;
    } }, { key: 'warning', value: function warning(

    raw) {
      _print(WARNING, raw);
      return log;
    } }, { key: 'error', value: function error(

    raw) {
      _print(ERROR, raw);
      return log;
    } }, { key: 'dispose', value: function dispose()

    {
      delete log.options;
      return log;
    } }]);return log;}();exports.default = log;