/**
 * Randomly picks one of the choices provided
 */

export function shuffle<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * Returns a random number with unit
 */
export function random(first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string {
    let val = first + (Math.random() * (last - first));
    if (wholeNumbersOnly === true) {
        val = Math.floor(val);
    }
    return !unit ? val : val + unit;
}
