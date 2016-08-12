import {isFunction} from './type';

export const pipe: Function = function pipe(): any {
    const args = arguments;
    const initial = args[0];
    let value: any = isFunction(initial) ? initial() : initial;

    const len = args.length;
    for (let x = 1; x < len; x++) {
        value = args[x](value);
    }

    return value;
};
