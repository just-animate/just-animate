import {ICallbackHandler, IConsumer, IMapper, IIndexed} from './interfaces';

const ostring = Object.prototype.toString;
const slice = Array.prototype.slice;

export function isArray(a) {
    return a !== undefined && typeof a !== 'string' && typeof a.length === 'number';
}

export function isFunction(a) {
    return ostring.call(a) === '[object Function]'
}

export function toArray<T>(indexed: IIndexed<T>): T[] {
    return slice.call(indexed, 0);
}

export function each<T1>(items: IIndexed<T1>, fn: IConsumer<T1>): void {
    for (var i = 0, len = items.length; i < len; i++) {
        fn(items[i]);
    }
}

export function map<T1, T2>(items: IIndexed<T1>, fn: IMapper<T1, T2>): T2[] {
    var results = [];
    for (var i = 0, len = items.length; i < len; i++) {
        var result = fn(items[i]);
        if (result !== undefined) {
            results.push(result);
        }
    }
    return results;
}

export function extend(target: any, ...sources: any[]) {
    for (var i = 1, len = arguments.length; i < len; i++) {
        var source = arguments[i];
        for (var propName in source) {
            if (source.hasOwnProperty(propName)) {
                target[propName] = source[propName];
            }
        }
    }
    return target;
}

export function multiapply(targets, fnName, args, cb?: ICallbackHandler): any[] {
    var errors = [];
    var results = [];
    for (var i = 0, len = targets.length; i < len; i++) {
        try {
            var target = targets[i];
            var result = target[fnName].apply(target, args);
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

