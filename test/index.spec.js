/* eslint-disable no-undef */
import { expect, assert } from 'chai'
import Zombee from '../src'
import { Promise } from 'es6-promise'

const TEST_URI = 'https://raw.githubusercontent.com/katopz/zombee/master/README.md'

describe('Zombee', () => {
  
  it('can creates a new Zombee instance', () => {
    const zombee = new Zombee()
    assert.typeOf(zombee, 'object')
  })

  it('can harvest once', () => new Promise((resolve, reject) => {
    const zombee = new Zombee()
    zombee.harvest(TEST_URI)
    zombee.on('succeed', (response) => {
      expect(response).to.be.ok
      resolve(true)
    })
  }))

  it('can harvest once, 1 sec later', () => new Promise((resolve, reject) => {
    const _timeout = setTimeout(() => { throw new Error('Something wrong') }, 2000)
    const zombee = new Zombee()
    zombee.harvest(TEST_URI, 1000)
    zombee.on('succeed', (response) => {
      clearTimeout(_timeout)
      zombee.stop()
      expect(response).to.be.ok
      resolve(true)
    })
  }))
})
