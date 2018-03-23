import { Observable } from './observable';
import { scheduler } from './scheduler';
import { Proxy as IEProxy } from '../polyfill/Proxy';
import { types } from './types';

declare var Proxy: any;

export function ObservableProxy<T>(target?: Record<string, T>) {
    target = target || ({} as Record<string, T>);

    const observable = new Observable<string[]>();
    let newProps: string[] = [];

    const propertyChanged = scheduler(() => {
        const nextVal = newProps;
        if (newProps.length) {
            newProps = [];
            observable.next(nextVal);
        }
    });

    const handler = {
        set(t: Record<string, T>, prop: string, value: any, _receiver: any) {
            t[prop] = value;
            if (newProps.indexOf(prop) === -1) {
                newProps.push(prop);
            }
            propertyChanged();
            return true;
        },
        deleteProperty(t: Record<string, T>, prop: string) {
            delete t[prop];
            if (newProps.indexOf(prop) === -1) {
                newProps.push(prop);
            }
            propertyChanged();
            return true;
        }
    };

    const proxy = new (typeof Proxy !== 'undefined' ? Proxy : IEProxy)(
        target,
        handler
    );

    // add subscription
    Object.defineProperty(proxy, 'subscribe', {
        enumerable: false,
        configurable: false,
        value: observable.subscribe.bind(observable)
    });

    return proxy as types.ObservableProxy<T>;
}
