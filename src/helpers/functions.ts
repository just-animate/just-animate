import {isFunction} from './type';

/**
 * Calls the named function for each object in the list
 * 
 * @export
 * @param {any[]} targets list of objects on which to call a function
 * @param {string} fnName function name to call on each object
 * @param {any[]} args list of arguments to pass to the function
 * @param {ja.ICallbackHandler} [cb] optional error handlers
 * @returns {any[]} all results as an array
 */
export function multiapply(targets: any[], fnName: string, args: any[], cb?: ja.ICallbackHandler): any[] {
    const errors = [] as any[];
    const results = [] as any[];
    for (let i = 0, len = targets.length; i < len; i++) {
        try {
            const target = targets[i];
            let result: any;
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
    if (isFunction(cb)) {
        cb(errors);
    }
    return results;
}


/**
 * No operation function: a placeholder
 * 
 * @export
 */
export function noop(): void {
    // do nothing
}