import { AnimationTarget, SplitTextResult } from '../types'
import { getTargets, pushAll, $, appendChild, attr } from '../utils'

function newElement(name: string, value: string, innerHTML?: string) {
  const el = document.createElement('div')
  attr(el, 'style', 'display:inline-block;position:relative;text-align:start')
  attr(el, name, value)
  if (innerHTML) {
    el.innerHTML = innerHTML
  }
  return el
}

/**
 * Detects words and characters from a target or a list of targets.
 * Note: if multiple targets are detected, they will return as a single
 * list of characters and numbers
 */
export function splitText(target: AnimationTarget): SplitTextResult {
  // output parameters
  const characters: HTMLElement[] = []
  const words: HTMLElement[] = []

  // acquiring targets ;)
  const elements = getTargets(target) as HTMLElement[]

  // get paragraphs, words, and characters for each element
  for (var i = 0, ilen = elements.length; i < ilen; i++) {
    var element = elements[i]

    // if we have already split this element, check if it was already split
    if (element.getAttribute('jast')) {
      const ws = $(element, '[jaw]')
      const cs = $(element, '[jac]')

      // if split already return query result
      if (ws.length || cs.length) {
        // apply found split elements
        pushAll(words, ws)
        pushAll(characters, cs)
        continue
      }
      // otherwise split it!
    }

    // remove tabs, spaces, and newlines
    const contents = element.textContent!.replace(/[\r\n\s\t]+/gi, ' ').trim()

    // clear element
    element.innerHTML = ''

    // mark element as already being split
    attr(element, 'jas', '')

    // split on spaces
    const ws = contents.split(/[\s]+/gi)

    // handle each word
    for (var j = 0, jlen = ws.length; j < jlen; j++) {
      var w = ws[j]
      // create new div for word/run"
      var word = appendChild(element, newElement('jaw', w))

      // add to the result
      words.push(word)

      // if not the first word, add a space
      if (j > 0) {
        appendChild(element, newElement('jas', '', '&nbsp;'))
      }

      for (var k = 0, klen = w.length; k < klen; k++) {
        var c = w[k]
        // create new div for character"
        // add to the result
        characters.push(appendChild(word, newElement('jac', c, c)))
      }
    }
  }

  return { characters, words }
}
