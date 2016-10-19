import {isFunction} from '../../common/type';
import {invalidArg} from '../../common/errors';
import {nil} from '../../common/resources';

export function Dispatcher(): IDispatcher {
    let self = this;
    self = self instanceof Dispatcher ? self : Object.create(Dispatcher.prototype);
    self._fn = {};
    return self;
}

Dispatcher.prototype = {
    _fn: nil as ICallbackMap,
    trigger(eventName: string, resolvable: any[] | { (): any[]; }): void {
        const listeners = this._fn[eventName];
        if (!listeners) {
            return;
        }
        const args = isFunction(resolvable) ? (resolvable as Function)() : resolvable as any[];
        for (const listener of listeners) {
            listener.apply(nil, args);
        }
    },
    on(eventName: string, listener: Function): void {
        if (!isFunction(listener)) {
            throw invalidArg('listener');
        }
        const fn = this._fn;
        const listeners = fn[eventName];
        if (!listeners) {
            fn[eventName] = [listener];
            return;
        }
        if (listeners.indexOf(listener) !== -1) {
            return;
        }
        listeners.push(listener);
    },
    off(eventName: string, listener: Function): void {
        const listeners = this._fn[eventName];
        if (listeners) {
            const indexOfListener = listeners.indexOf(listener);
            if (indexOfListener !== -1) {
                listeners.splice(indexOfListener, 1);
            }
        }
    }
};

export interface IDispatcher {
    trigger(eventName: string, args?: any[] | { (): any[]; }): void;
    on(eventName: string, listener: Function): void;
    off(eventName: string, listener: Function): void;
}

interface ICallbackMap {
    [eventName: string]: Function[];
} 
