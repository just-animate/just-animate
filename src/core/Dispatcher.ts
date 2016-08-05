import {isFunction} from '../helpers/type';
import {invalidArg} from '../helpers/errors';

const dispatcher = {
    _fn: undefined as ICallbackMap,

    trigger(eventName: string, args?: any[]): void {
        const listeners = this._fn[eventName];
        if (!listeners) {
            return;
        }
        const len = listeners.length;
        for (let i = 0; i < len; i++) {
            listeners[i].apply(undefined, args);
        }
    },
    on(eventName: string, listener: Function): void {
        if (!isFunction(listener)) {
            throw invalidArg('listener');
        }
        const listeners = this._fn[eventName];
        if (!listeners) {
            this._fn[eventName] = [listener];
            return;
        }
        if (listeners.indexOf(listener) !== -1) {
            return;
        }
        listeners.push(listener);
    },
    off(eventName: string, listener: Function): boolean {
        const listeners = this._fn[eventName];
        if (!listeners) {
            return false;
        }
        const indexOfListener = listeners.indexOf(listener);
        if (indexOfListener === -1) {
            return false;
        }
        listeners.splice(indexOfListener, 1);
        return true;
    }
};

export function createDispatcher(): IDispatcher {
    const self = Object.create(dispatcher);
    self._fn = {};
    return self;
}

export interface IDispatcher {
    trigger(eventName: string, args?: any[]): void;
    on(eventName: string, listener: Function): void;
    off(eventName: string, listener: Function): boolean;
}

interface ICallbackMap {
    [eventName: string]: Function[];
} 
