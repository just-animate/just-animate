function element(innerHTML?: string) {
  const el = document.createElement('div')
  el.setAttribute('style', 'display:inline-block;position:relative;text-align:start')
  el.innerHTML = innerHTML || ''
  return el
}

/**
 * Detects words and characters from a target or a list of targets.
 * Note: if multiple targets are detected, they will return as a single
 * list of characters and numbers
 */
export function splitText(target: HTMLElement | string) {
  // output parameters
  const characters: HTMLElement[] = []
  const words: HTMLElement[] = []

  // acquiring targets ;)
  const elements =
    typeof target === 'string'
      ? document.querySelectorAll(target as string) as any
      : target instanceof Element
        ? [target as HTMLElement]
        : typeof (target as any[]).length === 'number'
          ? target :
          [];
  
  // get paragraphs, words, and characters for each element
  for (let i = 0, ilen = elements.length; i < ilen; i++) {
    var e = elements[i]
    if (!e) {
        continue
      }

    // remove tabs, spaces, and newlines
    var contents = e.textContent!.replace(/[\r\n\s\t]+/gi, ' ').trim()

    // clear element
    e.innerHTML = ''

    // split on spaces
    var ws = contents.split(/[\s]+/gi)

    // handle each word
    for (let x = 0, xlen = ws.length; x < xlen; x++) {
      var w = ws[x]  
      if (!w) {
        continue
      }
      // if not the first word, add a space
      if (x > 0) {
        var empty = element('&nbsp;')
        e.appendChild(empty)
      }

      // create new div for word/run"
      // add to the result   
      var word = element()
      words.push(word)
      e.appendChild(word)     

      // create new div for character"
      // add to the result
      for (let y = 0, ylen = w.length; y < ylen; y++) {
        var c = w[y]
        var character = element(c)
        word.appendChild(character)
        characters.push(character)
      }
    }
  }

  return { characters, words }
}
