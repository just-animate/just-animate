export const invalidArg = (name: string): Error => new Error(`Bad: ${name}`);
export const unsupported = (msg: string): Error => new Error(`Unsupported: ${msg}`);
