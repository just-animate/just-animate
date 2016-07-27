import {each} from '../helpers/lists';
import {isFunction} from '../helpers/type';

export class Dispatcher {

    private _listeners: { [eventName: string]: Function[] } = {};

    public trigger(eventName: string, args?: any[]): void {
        const listeners = this._listeners[eventName];
        if (!listeners) {
            return;
        }
        each(listeners, (l: Function) => l.apply(undefined, args));
    }

    public on(eventName: string, listener: Function): void {
        if (!isFunction(listener)) {
            throw Error('invalid listener');
        }
        const listeners = this._listeners[eventName];
        if (!listeners) {
            this._listeners[eventName] = [listener];
            return;
        }
        if (listeners.indexOf(listener) !== -1) {
            return;
        }
        listeners.push(listener);
    }

    public off(eventName: string, listener: Function): boolean {
        const listeners = this._listeners[eventName];
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
}