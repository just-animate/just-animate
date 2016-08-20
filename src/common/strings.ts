import { isString } from './type';
import { toArray } from './lists';
import { nil, camelCaseRegex } from './resources';

const ostring = Object.prototype.toString;

function camelCaseReplacer(match: string, p1: string, p2: string): string {
    return p1 + p2.toUpperCase();
}

export function toCamelCase(value: string): string {
    return isString(value) ? value.replace(camelCaseRegex, camelCaseReplacer) : nil;
}

export const cssFunction: Function = function(): string {
    const args = arguments;
    return `${args[0]}(${toArray(args, 1).join(',')})`;
};

export function toString(val: any): string {
    return ostring.call(val);
}
