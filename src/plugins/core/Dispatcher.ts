import { invalidArg, isFunction } from '../../common';

export class Dispatcher<TContext, TEventType extends string> {
    private _fn: { [key: string]: { (ctx: TContext): void }[] };
    constructor() {
        this._fn = {};
    }

    public trigger(eventName: TEventType, resolvable: ja.AnimationTimeContext | { (): ja.AnimationTimeContext; }): void {
        const listeners = this._fn[eventName as string];
        if (!listeners) {
            return;
        }
        const ctx: TContext = isFunction(resolvable)
            ? (resolvable as Function)()
            : resolvable;
        for (const listener of listeners) {
            listener(ctx);
        }
    }
    public on(eventName: TEventType, listener: { (ctx: TContext): void }): void {
        if (!isFunction(listener)) {
            throw invalidArg('listener');
        }
        const fn = this._fn;
        const listeners = fn[eventName as string];
        if (!listeners) {
            fn[eventName as string] = [listener];
            return;
        }
        if (listeners.indexOf(listener) !== -1) {
            return;
        }
        listeners.push(listener);
    }
    public off(eventName: string, listener: { (ctx: TContext): void }): void {
        const listeners = this._fn[eventName];
        if (listeners) {
            const indexOfListener = listeners.indexOf(listener);
            if (indexOfListener !== -1) {
                listeners.splice(indexOfListener, 1);
            }
        }
    }
}


