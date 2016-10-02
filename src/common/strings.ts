import { isString } from './type';
import { toArray } from './lists';
import { nil, camelCaseRegex } from './resources';

function camelCaseReplacer(match: string, p1: string, p2: string): string {
    return p1 + p2.toUpperCase();
}

export function toCamelCase(value: string): string {
    return isString(value) ? value.replace(camelCaseRegex, camelCaseReplacer) : nil;
}

export function startsWith(value: string, pattern: string): boolean {
    return value.indexOf(pattern) === 0;
}

export const cssFunction: Function = function(): string {
    const args = arguments;
    return `${args[0]}(${toArray(args, 1).join(',')})`;
};
