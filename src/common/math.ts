export const inRange = (val: number, min: number, max: number): boolean => {
    return min < max ? min <= val && val <= max : max <= val && val <= min;
};
