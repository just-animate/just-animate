import * as chai from 'chai'
const { assert } = chai
import { splitText } from '../../src/extras'

describe('splitText()', () => {
  it('splits innerText characters into individual divs', () => {
    const element = document.createElement('h2')
    element.innerHTML = 'Hello World!'

    const letters = splitText(element).characters
    assert.equal(letters.length, 11)
    assert.equal(letters[0].textContent, 'H')
    assert.equal(letters[1].textContent, 'e')
    assert.equal(letters[2].textContent, 'l')
    assert.equal(letters[3].textContent, 'l')
    assert.equal(letters[4].textContent, 'o')
    assert.equal(letters[5].textContent, 'W')
    assert.equal(letters[6].textContent, 'o')
    assert.equal(letters[7].textContent, 'r')
    assert.equal(letters[8].textContent, 'l')
    assert.equal(letters[9].textContent, 'd')
    assert.equal(letters[10].textContent, '!')
  })

  it('it removes double spaces and newlines', () => {
    const element = document.createElement('h2')
    element.innerHTML = 's  \n\ts'
    const letters = splitText(element).characters

    assert.equal(letters.length, 2)
    assert.equal(letters[0].textContent, 's')
    assert.equal(letters[1].textContent, 's')
  })

  it('it removes whitespace before and after', () => {
    const element = document.createElement('h2')
    element.innerHTML = '  t  '
    const letters = splitText(element).characters

    assert.equal(letters.length, 1)
    assert.equal(letters[0].textContent, 't')
  })

  it('splits words by space and removes empty parts', () => {
    const element = document.createElement('h2')
    element.innerHTML = 'Hello  World!'

    const words = splitText(element).words
    assert.equal(words.length, 2)
    assert.equal(words[0].textContent, 'Hello')
    assert.equal(words[1].textContent, 'World!')
  })

  it('splits words and trims words', () => {
    const element = document.createElement('h2')
    element.innerHTML = '   Hello! '

    const words = splitText(element).words
    assert.equal(words.length, 1)
    assert.equal(words[0].textContent, 'Hello!')
  })

  it('splits words and trims words', () => {
    const element = document.createElement('h2')
    element.innerHTML = '   Hello! '

    const words = splitText(element).words
    assert.equal(words.length, 1)
    assert.equal(words[0].textContent, 'Hello!')
  })
})
