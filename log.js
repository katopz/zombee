import fs from 'fs'
import path from 'path'

// Private
const INFO = '*'
const WARNING = '#'
const ERROR = '!'

// Default
export const defaultOptions = {
  folder: 'logs',
  name: 'zombee_',
  ext: 'log'
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
    // Input
    const text = (raw instanceof String) ? raw : JSON.stringify(raw)
    const at = new Date()

    // Not config yet?
    if (!log.options || (_getCurrentYMD() !== log.options.stamp)) {
      log.config(log.options || defaultOptions)
    }

    // Log
    log.options.console && log.options.console.log([
      process.pid,
      +at,
      at.toUTCString(),
      type,
      text
    ].join(' | '))
  } catch (err) {
    console.error(err)
  }
}

export default class log {
  static config(customOptions) {
    try {

      // Options
      log.options = Object.assign({}, defaultOptions, customOptions)

      // Cursor
      log.options.stamp = _getCurrentYMD()

      // Writer
      const { folder, name, ext, stamp } = log.options

      // Filter bad path
      if (!_isAllowedPath(folder) || !_isAllowedPath(name)) {
        throw new Error('Absolute path not allow.')
      }

      // Ensure folder exist
      _ensureFolderExist(folder)

      // Output
      const output = fs.createWriteStream(`${folder}/${name}${stamp}.${ext}`, { flags: 'a' })
      log.options.output = output

      // Console -> Output
      log.options.console = new console.Console(output, output)
    } catch (err) {
      console.error(err)
    }

    return log
  }

  static info(raw) {
    _print(INFO, raw)
    return log
  }

  static warning(raw) {
    _print(WARNING, raw)
    return log
  }

  static error(raw) {
    _print(ERROR, raw)
    return log
  }

  static dispose() {
    delete log.options
    return log
  }
}