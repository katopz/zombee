import EventEmitter from 'events';
import fetch from './fetch';

export default class Zombee {
  // events
  static get FETCH() { return 'fetch' }
  static get ERROR() { return 'error' }
  static get FAILED() { return 'failed' }
  static get SUCCEED() { return 'succeed' }

  on(eventName, listener) {
    this.emitter.on(eventName, listener)
    return this
  }

  get emitter() {
    this._emitter = this._emitter || new EventEmitter()
    return this._emitter
  }

  emit(...args) {
    this.emitter && this.emitter.emit.apply(this.emitter, args)
  }

  // loop
  static get SEC() { return 1000 }
  static get MINUTE() { return 1000 * 60 }

  every(interval) {
    this._interval = interval
    return this
  }

  // system
  watchProcess() {
    if (this._isWatched) {
      return
    }
    this._isWatched = true;

    this._watchForAnyError()
    this._watchForExit()
  }

  // actions
  harvest(uri) {
    if (!uri) {
      return this;
    }

    if (this._interval) {
      // Do once
      const __interval = this._interval
      delete this._interval
      this._repeat(uri, __interval)
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
    this.stop()
  }

  _fetch(uri) {
    if (!uri) {
      const err = new Error('Required uri.')
      this.emit(Zombee.ERROR, err)
      return this;
    }

    // Job
    this.watchProcess()
    this.emit(Zombee.FETCH, uri)
    fetch(uri).then(response => {
      // failure
      if (response.status >= 400) {
        this.emit(Zombee.FAILED, response)
        return response
      } else {
        // succeed
        this.emit(Zombee.SUCCEED, response)
        return response
      }
    }).catch(err => {
      // error
      this.emit('error', err)
    });

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
      this.emit('error', err)
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