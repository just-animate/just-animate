export function clone<T1, T2, T3>(t1: T1): T1
export function clone<T1, T2, T3>(t1: T1, t2: T2): T1 & T2
export function clone<T1, T2, T3>(t1: T1, t2: T2, t3: T3): T1 & T2 & T3
export function clone<T1, T2, T3, T4>(t1: T1, t2: T2, t3: T3, t4: T4): T1 & T2 & T3 & T4
export function clone() {
    const args = arguments
    const target = {}
    for (let i = 0; i < args.length; i++) {
        const source = args[i]
        for (var prop in source) {
            target[prop] = source[prop]
        }
    }
    return target
}

/**
 * One of the cheapest ways to do a deep object clone
 * @param input 
 */
export function deepClone<T>(input: T): T {
    return JSON.parse(JSON.stringify(input)) as T;
}

/**
 * Return the object at that property.  If the property is not found, a new object will be added on that property.
 * @param obj to traverse
 * @param prop to find or add
 */
export function addOrGet<T extends { [P in keyof T]: T[P] }>(obj: T, prop: keyof T): T[keyof T] {
    return obj[prop] || (obj[prop] = {})
}
