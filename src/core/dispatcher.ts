import { isFunction } from '../utils';

function trigger <TContext>(this: ja.IDispatcher<TContext>, eventName: string, resolvable: ja.AnimationTimeContext | { (): ja.AnimationTimeContext; }): ja.IDispatcher<TContext> {
    const self = this;
    const listeners = self._listeners[eventName as string];
    if (listeners) {
        const ctx: TContext = isFunction(resolvable)
            ? (resolvable as Function)()
            : resolvable;

        for (const listener of listeners) {
            listener(ctx);
        }
    }
    return self;
}

function on <TContext>(this: ja.IDispatcher<TContext>, eventName: string, listener: { (ctx: TContext): void }): ja.IDispatcher<TContext> {
    const self = this;
    const { _listeners } = self;
    
    const listeners = _listeners[eventName] || (_listeners[eventName] = []);
    if (listeners.indexOf(listener) === -1) {
        listeners.push(listener);
    }
    
    return self;
}

function off<TContext>(this: ja.IDispatcher<TContext>, eventName: string, listener: { (ctx: TContext): void }): ja.IDispatcher<TContext> {
    const self = this;
    const listeners = self._listeners[eventName];
    if (listeners) {
        const indexOfListener = listeners.indexOf(listener);
        if (indexOfListener !== -1) {
            listeners.splice(indexOfListener, 1);
        }
    }
    return self;
}

export const dispatcher = <T>(): ja.IDispatcher<T> => {
    return {
        _listeners: {} as { [key: string]: { (ctx: T): void }[] },
        trigger,
        on,
        off
    };
};
