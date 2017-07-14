import { AnimationTarget, SplitTextResult } from '../types'
import { getTargets, pushAll, $, appendChild, attr, each } from '../utils'

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
  each(elements, element => {
    // if we have already split this element, check if it was already split
    if (element.getAttribute('jast')) {
      const ws = $(element, '[jaw]')
      const cs = $(element, '[jac]')

      // if split already return query result
      if (ws.length || cs.length) {
        // apply found split elements
        pushAll(words, ws)
        pushAll(characters, cs)
        return
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
    each(ws, (w, j) => {
      // create new div for word/run"
      var word = appendChild(element, newElement('jaw', w))

      // add to the result
      words.push(word)

      // if not the first word, add a space
      if (j > 0) {
        appendChild(element, newElement('jas', '', '&nbsp;'))
      }

      // create new div for character"
      // add to the result
      each(w, c => { characters.push(appendChild(word, newElement('jac', c, c))) })
    })
    
  })

  return { characters, words }
}
