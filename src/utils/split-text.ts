import { getTargets, toArray } from '.'

const applySplitStyles = (element: HTMLElement) => {
    element.style.display = 'inline-block'
    element.style.position = 'relative'
    element.style.textAlign = 'start'
}

/**
 * Detects words and characters from a target or a list of targets.
 * Note: if multiple targets are detected, they will return as a single
 * list of characters and numbers
 * 
 * @param {ja.AnimationDomTarget} target
 * @returns {ja.SplitTextResult}
 * 
 * @memberOf JustAnimate
 */
export const splitText = (target: ja.AnimationTarget): ja.SplitTextResult => {

    // output parameters
    const characters: HTMLElement[] = []
    const words: HTMLElement[] = []

    // acquiring targets ;)    
    const elements = getTargets(target) as HTMLElement[]

    // get paragraphs, words, and characters for each element
    for (let i = 0, ilen = elements.length; i < ilen; i++) {
        const element = elements[i]

        // if we have already split this element, check if it was already split
        if (element.getAttribute('ja-split-text')) {
            const ws = toArray(element.querySelectorAll('[ja-word]'))
            const cs = toArray(element.querySelectorAll('[ja-character]'))

            // if split already return query result
            if (ws.length || cs.length) {
                // apply found split elements
                words.push.apply(words, ws)
                characters.push.apply(characters, cs)
                continue
            }
            // otherwise split it!
        }

        // remove tabs, spaces, and newlines
        const contents = element.textContent!.replace(/[\r\n\s\t]+/ig, ' ').trim()

        // clear element
        element.innerHTML = ''

        // mark element as already being split
        element.setAttribute('ja-split', '')

        // split on spaces
        const ws = contents.split(/[\s]+/ig)

        // handle each word
        for (let j = 0, jlen = ws.length; j < jlen; j++) {
            const w = ws[j]
            // create new div for word/run"
            const word = document.createElement('div')
            applySplitStyles(word)

            // mark element as a word                    
            word.setAttribute('ja-word', w)
            // add to the result  
            words.push(word)

            // if not the first word, add a space            
            if (j > 0) {
                const space = document.createElement('div')
                applySplitStyles(space)
                space.innerHTML = '&nbsp;'
                space.setAttribute('ja-space', '')
                element.appendChild(space)
            }

            // add to the paragraph  
            element.appendChild(word)

            for (let k = 0, klen = w.length; k < klen; k++) {
                const c = w[k]
                // create new div for character"
                const char = document.createElement('div')
                applySplitStyles(char)
                char.textContent = c

                // mark element as a character                    
                char.setAttribute('ja-character', c)
                // add to the result                    
                characters.push(char)
                // append to the word                            
                word.appendChild(char)
            }
        }
    }

    return {
        characters: characters,
        words: words
    }
}
