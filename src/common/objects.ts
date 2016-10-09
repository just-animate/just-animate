import { isArray, isDefined, isFunction, isObject, getTypeString } from './type';
import { nil } from './resources';

/**
 * Extends the first object with the properties of each subsequent object
 * 
 * @export
 * @param {*} target object to extend
 * @param {...any[]} sources sources from which to inherit properties
 * @returns {*} first object
 */
export const extend: Function = function (): any {
    const args = arguments;
    const target = args[0];
    for (let i = 1, len = args.length; i < len; i++) {
        const source = args[i];
        for (let propName in source) {
            target[propName] = source[propName];
        }
    }
    return target;
};

export function deepCopyObject<T1, T2>(origin: {}, dest?: {}): any {
    dest = dest || {};
    for (let prop in origin) {
        deepCopyProperty(prop, origin, dest);
    }
    return dest;
}

export function deepCopyProperty(prop: string|number, origin: {}, dest: {}): void {
    const originProp = origin[prop];
    let destProp = dest[prop];

    // if the source and target don't have the same type, replace with target
    const originType = getTypeString(originProp);
    const destType = getTypeString(destProp);

    if (originType !== destType) {
        destProp = nil;
    }
    
    if (isArray(originProp)) {
        // note: a compromise until a solution for merging arrays becomes clear
        dest[prop] = originProp.slice(0);
    } else if (isObject(originProp)) {
        dest[prop] = deepCopyObject(originProp, destProp);
    } else {
        dest[prop] = originProp;
    }
}

export function inherit<T1, T2>(target: T1, source: T2): T1&T2 {
    for (let propName in source) {
        if (!isDefined(target[propName])) {
            target[propName] = source[propName];
        }
    }
    return target as T1&T2;
};

export const expand: Function = function (expandable: any): any {
    const result = {};
    for (let prop in expandable) {
        let propVal = expandable[prop];
        if (isFunction(propVal)) {
            propVal = propVal();
        } else if (isObject(propVal)) {
            propVal = expand(propVal);
        }
        result[prop] = propVal;
    }
    return result;
};

export function resolve<T1, T2>(value: T1 | ja.Resolver<T1>, ctx: ja.CreateAnimationContext<T2>): T1 {
    if (!isFunction(value)) {
        return value as T1;
    }
    return (value as ja.Resolver<T1>)(ctx.target, ctx.index, ctx.targets);
}


export function listProps<T>(indexed: T[]): string[] {
    const props: string[] = [];

    const len = indexed.length;
    for (let i = 0; i < len; i++) {
        const item = indexed[i];
        for (let property in item) {
            if (props.indexOf(property) === -1) {
                props.push(property);
            }
        }
    }

    return props;
}
