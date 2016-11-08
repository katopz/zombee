'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.defaultOption = undefined;var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

// Private
var INFO = '*';
var WARNING = '#';
var ERROR = '!';

// Default
var defaultOption = exports.defaultOption = {
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
    if (!log.option || _getCurrentYMD() !== log.option.stamp) {
      log.config(log.option || defaultOption);
    }

    // Log
    log.option.console && log.option.console.log([
    process.pid,
    +at,
    at.toUTCString(),
    type,
    text].
    join(' | '));
  } catch (err) {
    console.error(err); // eslint-disable-line
  }
};var

log = function () {function log() {_classCallCheck(this, log);}_createClass(log, null, [{ key: 'config', value: function config(
    customOption) {
      try {

        // Option
        log.option = Object.assign({}, defaultOption, customOption);

        // Cursor
        log.option.stamp = _getCurrentYMD();

        // Writer
        var _log$option = log.option,folder = _log$option.folder,name = _log$option.name,ext = _log$option.ext,stamp = _log$option.stamp;

        // Filter bad path
        if (!_isAllowedPath(folder) || !_isAllowedPath(name)) {
          throw new Error('Absolute path not allow.');
        }

        // Ensure folder exist
        _ensureFolderExist(folder);

        // Output
        var output = _fs2.default.createWriteStream(folder + '/' + name + stamp + '.' + ext, { flags: 'a' });
        log.option.output = output;

        // Console -> Output
        log.option.console = new console.Console(output, output); // eslint-disable-line
      } catch (err) {
        console.error(err); // eslint-disable-line
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
      delete log.option;
      return log;
    } }]);return log;}();exports.default = log;