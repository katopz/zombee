import EventEmitter from 'events';
import fetch from './fetch';
import log from './log'

export default class Zombee extends EventEmitter {

  /*
  static FAILED = 'failed'
  static ERROR = 'error'
  static SUCCEED = 'succeed'

  static ONE_MINUTE = 1000 * 60
  static FIVE_MINUTE = 1000 * 60
  */

  constructor(uri, interval) {
    super()

    this._watchForAnyError()
    this._watchForExit()

    this._fetch(uri)
    interval && this._repeat(uri, interval) 
  }

  _fetch(uri) {
    try {
      // Perf
      const now = () => { return +new Date() }
      const begin = now()

      // Job
      fetch(uri)
        .then(response => {
          // Perf
          const end = now()
          log.info({
            begin,
            end,
            latency: end - begin,
            status: response.status,
          })

          // failure
          if (response.status >= 400) {
            log.error(response.statusText)
            this.emit('failed', response)
          }

          // succeed
          this.emit('succeed', response)
        }).catch(err => {
          // error
          log.error(err);
          this.emit('error', err)
        });
    } catch (err) {
      console.error(err) // eslint-disable-line
    }
  }

  _repeat(uri, interval) {
    this.bee = setInterval(
      this._fetch,
      interval,
      uri
    )
  }

  _watchForAnyError() {
    process.on('uncaughtException', (err) => {
      console.error(err)  // eslint-disable-line
    });
  }

  _watchForExit() {
    // Graceful Shutdown
    process.on('SIGTERM', () => {
      try {
        // self
        this.dispose()

        // log
        log.info('EXIT')
        log.dispose()
      } catch (err) {
        console.error(err) // eslint-disable-line
      }

      process.exit(0)
    })
  }

  dispose() {
    this.bee && clearInterval(this.bee)
  }
}