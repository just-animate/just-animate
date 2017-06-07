import { toArray } from './lists';
import { isArray, isElement, isFunction, isObject, isString } from './type';
import { invalidArg } from './errors';

const applySplitStyles = (element: HTMLElement): void => {
    element.style.display = 'inline-block';
    element.style.position = 'relative';
    element.style.textAlign = 'start';
};

/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 * 
 * @param {ja.ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
export const getTargets = (target: ja.AnimationTarget): (Element | {})[] => {
    if (!target) {
        throw invalidArg('source');
    }
    if (isString(target)) {
        // if query selector, search for elements 
        return toArray(document.querySelectorAll(target as string));
    }
    if (isElement(target)) {
        // if a single element, wrap in array 
        return [target] as Element[];
    }
    if (isFunction(target)) {
        // if function, call it and call this function
        const provider = target as { (): ja.AnimationTarget; };
        const result = provider();
        return getTargets(result);
    }
    if (isArray(target)) {
        // if array or jQuery object, flatten to an array
        const elements: Element[] = [];
        for (const i of target as ja.AnimationTarget[]) {
            // recursively call this function in case of nested elements
            const innerElements = getTargets(i);
            elements.push.apply(elements, innerElements);
        }
        return elements;
    }
    if (isObject(target)) {
        // if it is an actual object at this point, handle it
        return [target] as {}[];
    }

    // otherwise return empty    
    return [];
};

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
    const characters: HTMLElement[] = [];
    const words: HTMLElement[] = [];

    // acquiring targets ;)    
    const elements = getTargets(target) as HTMLElement[];

    // get paragraphs, words, and characters for each element
    for (const element of elements) {

        // if we have already split this element, check if it was already split
        if (element.getAttribute('ja-split-text')) {
            const ws = toArray(element.querySelectorAll('[ja-word]'));
            const cs = toArray(element.querySelectorAll('[ja-character]'));

            // if split already return query result
            if (ws.length || cs.length) {
                // apply found split elements
                words.push.apply(words, ws);
                characters.push.apply(characters, cs);
                continue;
            }
            // otherwise split it!
        }

        // remove tabs, spaces, and newlines
        const contents = element.textContent!.replace(/[\r\n\s\t]+/ig, ' ').trim();

        // clear element
        element.innerHTML = '';

        // mark element as already being split
        element.setAttribute('ja-split', '');

        // split on spaces
        const ws = contents.split(/[\s]+/ig);

        // handle each word
        for (let i = 0, len = ws.length; i < len; i++) {
            const w = ws[i];
            // create new div for word/run"
            const word = document.createElement('div');
            applySplitStyles(word);

            // mark element as a word                    
            word.setAttribute('ja-word', w);
            // add to the result  
            words.push(word);

            // if not the first word, add a space            
            if (i > 0) {
                const space = document.createElement('div');
                applySplitStyles(space);
                space.innerHTML = '&nbsp;';
                space.setAttribute('ja-space', '');
                element.appendChild(space);
            }

            // add to the paragraph  
            element.appendChild(word);

            for (const c of w) {
                // create new div for character"
                const char = document.createElement('div');
                applySplitStyles(char);
                char.textContent = c;

                // mark element as a character                    
                char.setAttribute('ja-character', c);
                // add to the result                    
                characters.push(char);
                // append to the word                            
                word.appendChild(char);
            }
        }
    }

    return {
        characters: characters,
        words: words
    };
};

