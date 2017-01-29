export const invalidArg = (name: string): Error => {
    return new Error(`Bad: ${name}`);
};

export const unsupported = (msg: string): Error => {
    return new Error(`Unsupported: ${msg}`);
};
