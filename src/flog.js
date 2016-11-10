import fs from 'fs'

// Type
export const LOG = '-'
export const INFO = '#'
export const DEBUG = '@'
export const WARN = '!'
export const ERROR = '*'

// Default
export const defaultOption = {
  folder: 'logs',
  name: 'zombee_',
  ext: 'log',
  ignores: [], // [INFO, DEBUG, WARN, ERROR],
  tags: 'ANY'
}

// Allow only word
const _isAllowedPath = (uri) => uri.match(/[^\w]/g) ? false : true

// Ensure folder exist
const _ensureFolderExist = (folder) => fs.existsSync(folder) || fs.mkdirSync(folder)

// Get current YYY-MM-DD
const _getCurrentYMD = () => new Date().toISOString().split('T')[0]

// Do print to console
const _print = (type, raw) => {
  try {
    // Not config yet?
    if (!flog.option || (_getCurrentYMD() !== flog.option.stamp)) {
      flog.config(flog.option || defaultOption)
    }

    // Ignore?
    if (flog.option.ignores && flog.option.ignores.includes(type)) {
      return;
    }

    // Input
    const text = (raw.constructor === String) ? raw : JSON.stringify(raw)
    const at = new Date()
    const tags = flog.option.tags

    // flog
    flog.option.console && flog.option.console.log([
      process.pid,
      +at,
      at.toUTCString(),
      type,
      tags,
      text
    ].join(' | '))
  } catch (err) {
    console.error(err) // eslint-disable-line
  }

  return flog;
}

export default class flog {
  static config(customOption) {
    try {
      // Will graceful shutdown.
      this._watchForExit()

      // Option
      flog.option = Object.assign({}, defaultOption, customOption)

      // Cursor
      flog.option.stamp = _getCurrentYMD()

      // Writer
      const { folder, name, ext, stamp } = flog.option

      // Filter bad path
      if (!_isAllowedPath(folder) || !_isAllowedPath(name)) {
        throw new Error('Absolute path not allow.')
      }

      // Ensure folder exist
      _ensureFolderExist(folder)

      // Output
      const output = fs.createWriteStream(`${folder}/${name}${stamp}.${ext}`, { flags: 'a' })
      flog.option.output = output

      // Console -> Output
      flog.option.console = new console.Console(output, output) // eslint-disable-line
    } catch (err) {
      console.error(err) // eslint-disable-line
    }

    return flog
  }

  static log(raw) {
    return _print(LOG, raw)
  }

  static info(raw) {
    return _print(INFO, raw)
  }

  static warn(raw) {
    return _print(WARN, raw)
  }

  static error(raw) {
    return _print(ERROR, raw)
  }

  static debug(raw) {
    return _print(DEBUG, raw)
  }

  static tags(value) {
    if (!flog.option) {
      flog.config()
    }

    flog.option.tags = value

    return flog
  }

  static catch() {
    process.on('uncaughtException', (err) => _print(ERROR, err));
    return flog
  }

  static dispose() {
    flog.option && flog.option.output && flog.option.output.end();
    delete flog.option
    return flog
  }

  static _watchForExit() {
    // DRY
    if (flog.isWatchedForExit) {
      return
    }

    flog.isWatchedForExit = true

    // Graceful Shutdown
    process.on('SIGTERM', () => {
      flog.isWatchedForExit = false;
      flog.dispose()
      process.exit(0)
    })
  }
}