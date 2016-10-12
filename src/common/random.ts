export function shuffle<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
}

export function random(first: number, last: number): number {
    return Math.floor(first + (Math.random() * (last - first)));
}
