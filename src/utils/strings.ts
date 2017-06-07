import { isString } from './type';
import { toArray } from './lists';
import { camelCaseRegex } from './resources';

function camelCaseReplacer(_: string, p1: string, p2: string): string {
    return p1 + p2.toUpperCase();
}

export function toCamelCase(value: string | undefined): string {
    return isString(value) ? (value as string).replace(camelCaseRegex, camelCaseReplacer) : '';
}

export function startsWith(value: string, pattern: string): boolean {
    return value.indexOf(pattern) === 0;
}

export const cssFunction: Function = function(): string {
    const args = arguments;
    return `${args[0]}(${toArray(args, 1).join(',')})`;
};

