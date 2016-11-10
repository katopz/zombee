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
  name: '',
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
    if (!firelog.option || (_getCurrentYMD() !== firelog.option.stamp)) {
      firelog.config(firelog.option || defaultOption)
    }

    // Ignore?
    if (firelog.option.ignores && firelog.option.ignores.includes(type)) {
      return
    }

    // Input
    const text = (raw.constructor === String) ? raw : JSON.stringify(raw)
    const at = new Date()
    const tags = firelog.option.tags

    // firelog
    firelog.option.console && firelog.option.console.log([
      process.pid,
      +at,
      at.toISOString(),
      type,
      tags,
      text
    ].join(' | '))
  } catch (err) {
    console.error(err) // eslint-disable-line
  }

  return firelog
}

let _times = new Map()

export default class firelog {
  static config(customOption) {
    try {
      // Option
      firelog.option = Object.assign({}, defaultOption, customOption)

      // Cursor
      firelog.option.stamp = _getCurrentYMD()

      // Writer
      const { folder, name, ext, stamp } = firelog.option

      // Filter bad path
      if (!_isAllowedPath(folder) || !_isAllowedPath(name)) {
        throw new Error('Absolute path not allow.')
      }

      // Ensure folder exist
      _ensureFolderExist(folder)

      // Output
      const output = fs.createWriteStream(`${folder}/${name}${stamp}.${ext}`, { flags: 'a' })
      firelog.option.output = output

      // Console -> Output
      firelog.option.console = new console.Console(output, output) // eslint-disable-line
    } catch (err) {
      console.error(err) // eslint-disable-line
    }

    return firelog
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
    if (!firelog.option) {
      firelog.config()
    }

    firelog.option.tags = value

    return firelog
  }

  static begin(label) {
    _times.set(label, +new Date())
    return firelog
  }

  static end(label) {
    const begin = _times.get(label)
    if (!begin) {
      process.emitWarning(`No such label '${label}' for firelog.end(...)`)
      return
    }

    const end = +new Date()
    const time = end - begin
    _times.delete(label)
    return { begin, end, time }
  }

  static catch() {
    process.on('uncaughtException', (err) => _print(ERROR, err))
    return firelog
  }

  static dispose() {
    firelog.option && firelog.option.output && firelog.option.output.end()
    delete firelog.option
    return firelog
  }

  // TODO : use instance
  _watchForExit() {
    // DRY
    if (firelog.isWatchedForExit) {
      return
    }

    firelog.isWatchedForExit = true

    // Graceful Shutdown
    process.on('SIGTERM', () => {
      firelog.isWatchedForExit = false
      firelog.dispose()
      process.exit(0)
    })
  }
}