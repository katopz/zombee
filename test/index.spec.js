/* eslint-disable no-undef */
import { expect, assert } from 'chai'
import Zombee from '../src';

describe('Zombee', () => {
  it('creates a new Zombee instance', () => {
    const zombee = new Zombee('https://raw.githubusercontent.com/katopz/zombee/master/README.md');
    assert.typeOf(zombee, 'object');
    zombee.on('succeed', (response) => {
      expect(response).to.be.ok;
    });
  });
});