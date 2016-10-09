import { isArray, isDefined, isFunction, isObject, getTypeString } from './type';
import { nil } from './resources';

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
