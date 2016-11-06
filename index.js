import fetch from 'isomorphic-fetch'
import microtime from 'microtime'

import log from './log'

// Input
const uri = 'https://raw.githubusercontent.com/katopz/vscode-debug-nodejs-es6/master/README.md'
const interval = 1000 * 1

// TODO : pub/sub with alerter?
const resolve = console.log
const reject = console.log
const error = console.log

// Tasks
const tasks = ({uri, resolve, reject, error}) => {
  try {
    // Perf
    const now = () => { return microtime.now() / 1000 }
    const begin = now()

    // Job
    fetch(uri)
      .then(response => {
        // Perf
        const end = now()
        log.info({
          begin,
          end,
          latency: (end - begin).toFixed(2),
          status: response.status,
        })

        // failure
        if (response.status >= 400) {
          log.error(response.statusText)
          reject && reject(response)
        }

        // succeed
        resolve && resolve(response)
      }).catch(err => {
        // error
        log.error(err);
        error && error(err)
      });
  } catch (err) {
    console.error(err)
  }
}

// Repeat
const bee = setInterval(
  tasks,
  interval,
  {
    uri,
    resolve,
    reject,
    error,
  }
)

// Graceful Shutdown
process.on('SIGTERM', () => {
  try {
    clearInterval(bee)
    log.info('EXIT')
    log.dispose()
  } catch (err) {
    console.error(err)
  }

  process.exit(0)
})