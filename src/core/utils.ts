import { REMOVE, REPLACE, ADD } from '../_constants'; 

const MAX_LEVEL = 2;

/**
 *
 * @param e
 * @param parent
 */
export function $(parent: Element, e: string | Element | NodeList) {
    return !e || (e as string).length === 0
        ? // null or empty string returns empty array
          []
        : (e as Element).nodeName
            ? // a single element is wrapped in an array
              [e]
            : // selector and NodeList are converted to Element[]
              [].slice.call(
                  e[0].nodeName
                      ? e
                      : (parent || document).querySelectorAll(e as string)
              );
}

export function isDefined(a: any) {
    return a !== undefined && a !== null;
}
export function isString(a: any) {
    return typeof a === 'string';
}
export function isDOM(target: Node | any) {
    return target.nodeType || target instanceof SVGElement;
}

export function pushAll<T>(c: T[], n: T[]) {
    Array.prototype.push.apply(c, n);
    return c;
}

export function diff<T>(a: T, b: T): ja.ChangeSet {
    return diffInner(a, b, [], 1) as ja.ChangeSet;
}

function diffInner<T>(
    a: T,
    b: T,
    walked: any[],
    level: number
): ja.ChangeSetOrCode {
    const changes = {} as { [P in keyof T]: number | {} };
    // walk through all the existing properties
    for (const name in a) {
        // get both values and types for comparison
        const aValue = a[name];
        const bValue = b[name];
        const aType = typeof aValue;
        const bType = typeof bValue;

        if (isDefined(aValue) && aType === 'object') {
            // escape circular reference
            if (walked.indexOf(aValue) !== -1) {
                continue;
            }
            walked.push(aValue);
        }

        if (!isDefined(bValue)) {
            // mark leaf as removed because the b side no longer exists
            changes[name] = REMOVE;
        } else if (aType !== bType) {
            // mark leaf as replaced because the types differ
            changes[name] = REPLACE;
        } else if (bType === 'object') {
            const c = diffInner(aValue, bValue, walked, level + 1);
            if (c) {
                // add dictionary of changes to this property name
                changes[name] = c;
            }
        } else if (aValue !== bValue) {
            // mark leaf as replaced if the primitive values differ
            changes[name] = REPLACE;
        }
    }
    // walk through all the new properties (to find added props)
    for (const name in b) {
        if (!isDefined(a[name])) {
            // if a didn't have this property, mark it as added
            changes[name] = ADD;
        }
    }
    // return empty if nothing changed.
    return keys(changes).length
        ? level > MAX_LEVEL ? REPLACE : (changes as ja.ChangeSet)
        : undefined;
}

export function copyInclude<T>(source: T, inclusions: string[]) {
    const dest: Partial<T> = {};
    for (let i = 0, iLen = inclusions.length; i < iLen; i++) {
        dest[inclusions[i]] = source[inclusions[i]];
    }
    return dest;
}

export function copyExclude<T>(source: T, exclusions?: string[]): Partial<T> {
    const dest: Partial<T> = {};
    for (const key in source) {
        if (exclusions && exclusions.indexOf(key) === -1) {
            dest[key] = source[key];
        }
    }
    return dest;
}

export const keys = Object.keys;
