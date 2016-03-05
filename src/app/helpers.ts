declare var jQuery;

import {ICallbackHandler, IConsumer, IMapper, IIndexed} from './types';

const ostring = Object.prototype.toString;
const slice = Array.prototype.slice;

export function noop(): void {
    // do nothing
}

export function isArray(a: any): boolean {
    return a !== undefined && typeof a !== 'string' && typeof a.length === 'number';
}

export function isFunction(a: any): boolean {
    return ostring.call(a) === '[object Function]';
}

export function isJQuery(a: any): boolean {
    return isFunction(jQuery) && a instanceof jQuery;
}

export function isString(a: any): boolean {
    return typeof a === 'string';
}

export function toArray<T>(indexed: IIndexed<T>): T[] {
    return slice.call(indexed, 0);
}

export function first<T1>(items: IIndexed<T1>): T1 {
    if (!items || items.length === 0) {
        return undefined;
    }
    return items[0];
}

export function each<T1>(items: IIndexed<T1>, fn: IConsumer<T1>): void {
    for (let i = 0, len = items.length; i < len; i++) {
        fn(items[i]);
    }
}

export function map<T1, T2>(items: IIndexed<T1>, fn: IMapper<T1, T2>): T2[] {
    const results = [];
    for (let i = 0, len = items.length; i < len; i++) {
        const result = fn(items[i]);
        if (result !== undefined) {
            results.push(result);
        }
    }
    return results;
}

export function extend(target: any, ...sources: any[]): any {
    for (let i = 1, len = arguments.length; i < len; i++) {
        const source = arguments[i];
        for (let propName in source) {
            if (source.hasOwnProperty(propName)) {
                target[propName] = source[propName];
            }
        }
    }
    return target;
}

export function multiapply(targets: IIndexed<any>, fnName: string, args: IIndexed<any>, cb?: ICallbackHandler): any[] {
    const errors = [];
    const results = [];
    for (let i = 0, len = targets.length; i < len; i++) {
        try {
            const target = targets[i];
            let result;
            if (fnName) {
                result = target[fnName].apply(target, args);
            } else {
                result = target.apply(undefined, args);
            }
            if (result !== undefined) {
                results.push(result);
            }
        } catch (err) {
            errors.push(err);
        }
    }
    if (typeof cb === 'function') {
        cb(errors);
    }
    return results;
}
