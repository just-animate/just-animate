import {isFunction} from './type';

export function pipe(initial: any|Function, ...args: Function[]): any {
    let value: any = isFunction(initial) ? initial() : initial;

    const len = arguments.length;
    for (let x = 1; x < len; x++) {
        value = arguments[x](value);
    }

    return value;
}
