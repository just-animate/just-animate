export function invalidArg(name: string): Error {
    return new Error(`Bad: ${name}`);
}
