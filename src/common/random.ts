/**
 * Returns one of the supplied values at random
 * 
 * @template T
 * @param {T[]} choices from which to choose
 * @returns {T} a choice at random
 * 
 * @memberOf JustAnimate
 */
export function shuffle<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
}

export function random(first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string {
    let val = first + (Math.random() * (last - first));
    if (wholeNumbersOnly === true) {
        val = Math.floor(val);
    }
    return !unit ? val : val + unit;
}
