import fs from 'fs'

// Private
const INFO = '*'
const WARNING = '#'
const ERROR = '!'

// Default
export const defaultOption = {
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
    if (!log.option || (_getCurrentYMD() !== log.option.stamp)) {
      log.config(log.option || defaultOption)
    }

    // Log
    log.option.console && log.option.console.log([
      process.pid,
      +at,
      at.toUTCString(),
      type,
      text
    ].join(' | '))
  } catch (err) {
    console.error(err) // eslint-disable-line
  }
}

export default class log {
  static config(customOption) {
    try {

      // Option
      log.option = Object.assign({}, defaultOption, customOption)

      // Cursor
      log.option.stamp = _getCurrentYMD()

      // Writer
      const { folder, name, ext, stamp } = log.option

      // Filter bad path
      if (!_isAllowedPath(folder) || !_isAllowedPath(name)) {
        throw new Error('Absolute path not allow.')
      }

      // Ensure folder exist
      _ensureFolderExist(folder)

      // Output
      const output = fs.createWriteStream(`${folder}/${name}${stamp}.${ext}`, { flags: 'a' })
      log.option.output = output

      // Console -> Output
      log.option.console = new console.Console(output, output) // eslint-disable-line
    } catch (err) {
      console.error(err) // eslint-disable-line
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
    delete log.option
    return log
  }
}