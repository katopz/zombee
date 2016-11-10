import EventEmitter from 'events';
import fetch from './fetch';
import flog from './flog'

export default class Zombee extends EventEmitter {

  /*
  static FAILED = 'failed'
  static ERROR = 'error'
  static SUCCEED = 'succeed'

  static ONE_MINUTE = 1000 * 60
  static FIVE_MINUTE = 1000 * 60
  */

  watchProcess() {
    this._watchForAnyError()
    this._watchForExit()
  }

  harvest(uri, interval) {
    if (!uri) {
      return this;
    }

    if (interval) {
      this._repeat(uri, interval)
    } else {
      this._fetch(uri)
    }

    return this;
  }

  stop() {
    clearInterval(this.bee)
    delete this.bee
    return this;
  }

  dispose() {
    try {
      this.stop()
    } catch (err) {
      console.error(err) // eslint-disable-line
    }
  }

  _fetch(uri) {
    try {
      if (!uri) {
        const err = new Error('Required uri.')
        flog.error(err);
        this.emit('error', err)
        return this;
      }

      // Perf
      const now = () => { return +new Date() }
      const begin = now()

      // Job
      fetch(uri).then(response => {
        // Perf
        const end = now()
        flog.info({
          begin,
          end,
          latency: end - begin,
          status: response.status,
        })

        // failure
        if (response.status >= 400) {
          flog.error(response.statusText)
          this.emit('failed', response)
        }

        // succeed
        this.emit('succeed', response)
      }).catch(err => {
        // error
        flog.error(err);
        this.emit('error', err)
      });
    } catch (err) {
      console.error(err) // eslint-disable-line
    }

    return this;
  }

  _repeat(uri, interval) {
    this.bee = setInterval(
      this._fetch.bind(this),
      interval,
      uri
    )

    return this;
  }

  _watchForAnyError() {
    process.on('uncaughtException', (err) => {
      console.error(err)  // eslint-disable-line
    });

    return this;
  }

  _watchForExit() {
    // Graceful Shutdown
    process.on('SIGTERM', () => {
      this.dispose()
      process.exit(0)
    })

    return this;
  }
}