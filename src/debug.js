import fs from 'fs'

// Type
export const INFO = '#'
export const DEBUG = '^'
export const WARN = '!'
export const ERROR = '*'

// Default
export const defaultOption = {
  folder: 'logs',
  name: 'zombee_',
  ext: 'log',
  ignores: [] // [INFO, DEBUG, WARN, ERROR]
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
    if (!debug.option || (_getCurrentYMD() !== debug.option.stamp)) {
      debug.config(debug.option || defaultOption)
    }

    // Ignore?
    if(debug.option.ignores && debug.option.ignores.includes(type))
    {
      return;
    }

    // Input
    const text = (raw.constructor === String) ? raw : JSON.stringify(raw)
    const at = new Date()

    // debug
    debug.option.console && debug.option.console.log([
      process.pid,
      +at,
      at.toUTCString(),
      type,
      text
    ].join(' | '))
  } catch (err) {
    console.error(err) // eslint-disable-line
  }

  return debug;
}

export default class debug {
  static config(customOption) {
    try {
      // Option
      debug.option = Object.assign({}, defaultOption, customOption)

      // Cursor
      debug.option.stamp = _getCurrentYMD()

      // Writer
      const { folder, name, ext, stamp } = debug.option

      // Filter bad path
      if (!_isAllowedPath(folder) || !_isAllowedPath(name)) {
        throw new Error('Absolute path not allow.')
      }

      // Ensure folder exist
      _ensureFolderExist(folder)

      // Output
      const output = fs.createWriteStream(`${folder}/${name}${stamp}.${ext}`, { flags: 'a' })
      debug.option.output = output

      // Console -> Output
      debug.option.console = new console.Console(output, output) // eslint-disable-line
    } catch (err) {
      console.error(err) // eslint-disable-line
    }

    return debug
  }

  static debug(raw) {
    return _print(DEBUG, raw)
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

  static dispose() {
    delete debug.option
    return debug
  }
}