export function shuffle<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
}

export function random(first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string {
    let val = first + (Math.random() * (last - first));
    if (wholeNumbersOnly === true) {
        val = Math.floor(val);
    }
    if (!unit) {
        return val;
    }
    return val + unit;
}
