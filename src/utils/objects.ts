import { isArray, isDefined, isFunction, isObject, getTypeString } from './type';
import { _ } from '.';

/**
 * Copies a single property from origin to destination
 */
export const deepCopyProperty = (prop: string | number, origin: {}, dest: {}): void => {
    const originProp = origin[prop];
    let destProp = dest[prop];

    // if the source and target don't have the same type, replace with target
    const originType = getTypeString(originProp);
    const destType = getTypeString(destProp);

    if (originType !== destType) {
        destProp = _;
    }
    
    if (isArray(originProp)) {
        // note: a compromise until a solution for merging arrays becomes clear
        dest[prop] = originProp.slice(0);
    } else if (isObject(originProp)) {
        // tslint:disable-next-line:no-use-before-declare
        dest[prop] = deepCopyObject(originProp, destProp);
    } else {
        dest[prop] = originProp;
    }
};

/**
 * performs a deep copy of properties from origin to destination
 */
export const deepCopyObject = <T1 extends {}, T2 extends {}>(origin: T1, dest?: T2): any => {
    dest = dest || {} as T2;
    for (let prop in origin) {
        deepCopyProperty(prop, origin, dest);
    }
    return dest;
};

/**
 * Copies the value from source to target if the source does not already have a value
 */
export const inherit = <T1, T2>(target: T1, source: T2): T1 & T2 => {
    // escape typing here, since there doesn't seem to be a sensible way to make this work
    const result = target as any;
    for (let propName in source) {
        if (!isDefined(result[propName])) {
            result[propName] = source[propName];
        }
    }
    return result as T1 & T2;
};

/**
 *  Resolves the property/value of an animation
 */
export const resolve = <T1>(value: T1 | ja.Resolver<T1>, ctx: ja.AnimationTargetContext<Element | {}>): T1 => {
    return isFunction(value) ? (value as ja.Resolver<T1>)(ctx) : value as T1;
};

export const listProps = <T>(indexed: T[]): string[] => {
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
};
