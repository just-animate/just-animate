import { invalidArg, isFunction } from '../utils';

type DispatcherCallback<T> = (ctx: T) => void;

function trigger <TContext>(this: IDispatcher<TContext>, eventName: string, resolvable: ja.AnimationTimeContext | { (): ja.AnimationTimeContext; }): void {
    const listeners = this.fns[eventName as string];
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

function on <TContext>(this: IDispatcher<TContext>, eventName: string, listener: { (ctx: TContext): void }): void {
    if (!isFunction(listener)) {
        throw invalidArg('listener');
    }
    const fn = this.fns;
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

function off <TContext>(this: IDispatcher<TContext>, eventName: string, listener: { (ctx: TContext): void }): void {
    const listeners = this.fns[eventName];
    if (listeners) {
        const indexOfListener = listeners.indexOf(listener);
        if (indexOfListener !== -1) {
            listeners.splice(indexOfListener, 1);
        }
    }
}

export interface IDispatcher<TContext> {
    fns: { [key: string]: { (ctx: TContext): void }[] };
    trigger(eventName: string, resolvable: ja.AnimationTimeContext | { (): ja.AnimationTimeContext; }): void;
    on(eventName: string, listener: { (ctx: TContext): void }): void;
    off(eventName: string, listener: { (ctx: TContext): void }): void;
}

export const dispatcher = <T>(): IDispatcher<T> => {
    return {
        fns: {} as { [key: string]: DispatcherCallback<T>[] },
        trigger,
        on,
        off
    };
};
