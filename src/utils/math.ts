export const inRange = (val: number, min: number, max: number) => min <= val && val <= max
export const clamp = (val: number, min: number, max: number) => val < min ? min : val > max ? max : val
