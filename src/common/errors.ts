export function invalidArg(name: string): Error {
    return new Error(`Bad: ${name}`);
}

export function unsupported(msg: string): Error {
    return new Error(`Unsupported: ${msg}`);
}
