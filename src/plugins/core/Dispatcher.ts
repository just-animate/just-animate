import { invalidArg, isFunction } from '../../common';

export const dispatcher = function <TContext, TEventType extends string>(): IDispatcher<TContext, TEventType> {
    const fn: { [key: string]: { (ctx: TContext): void }[] } = {};

    const self = {
        trigger(eventName: TEventType, resolvable: ja.AnimationTimeContext | { (): ja.AnimationTimeContext; }): void {
            const listeners = fn[eventName as string];
            if (listeners) {
                const ctx: TContext = isFunction(resolvable)
                    ? (resolvable as Function)()
                    : resolvable;
                for (let i = 0, len = listeners.length; i < len; i++) {
                    listeners[i](ctx);
                }
            }
        },
        on(eventName: TEventType, listener: { (ctx: TContext): void }): void {
            if (!isFunction(listener)) {
                throw invalidArg('listener');
            }
            const listeners = fn[eventName as string];
            if (!listeners) {
                fn[eventName as string] = [listener];
                return;
            }
            if (listeners.indexOf(listener) !== -1) {
                return;
            }
            listeners.push(listener);
        },
        off(eventName: string, listener: { (ctx: TContext): void }): void {
            const listeners = fn[eventName];
            if (listeners) {
                const indexOfListener = listeners.indexOf(listener);
                if (indexOfListener !== -1) {
                    listeners.splice(indexOfListener, 1);
                }
            }
        }
    };

    return self;
};

export interface IDispatcher<TContext, TEventType extends string> {
    trigger(eventName: TEventType, resolvable: ja.AnimationTimeContext | { (): ja.AnimationTimeContext; }): void;
    on(eventName: TEventType, listener: { (ctx: TContext): void }): void;
    off(eventName: string, listener: { (ctx: TContext): void }): void;
}
