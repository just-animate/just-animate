import { AnimationTarget, SplitTextResult } from '../types'
import { attr, appendChild, $ } from '../utils/elements'
import { getTargets } from '../utils/get-targets'
import { forEach, pushAll, push } from '../utils/lists'
import { getPlugins } from './plugins';

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
  const elements = getTargets(target, getPlugins()) as HTMLElement[]

  // get paragraphs, words, and characters for each element
  forEach(elements, element => {
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
    forEach(ws, (w, j) => {
      // if not the first word, add a space
      if (j > 0) {
        appendChild(element, newElement('jas', '', '&nbsp;'))
      }
      
      // create new div for word/run"
      // add to the result
      var word = push(words, appendChild(element, newElement('jaw', w)))

      // create new div for character"
      // add to the result
      forEach(w, c =>
        push(characters, appendChild(word, newElement('jac', c, c)))
      )
    })
  })

  return { characters, words }
}
