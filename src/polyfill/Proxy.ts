import { types } from '../core/types';

export function Proxy<T extends {} = {}>(
    target: T,
    handler: types.IProxyHandler<T>
) {
    // create property definition
    const configuration = {} as { [P in keyof T]: PropertyDescriptor };
    for (const key in target) {
        configuration[key] = {
            enumerable: true,
            get() {
                return handler.get ? handler.get(target, key) : target[key];
            },
            set(val: T[keyof T]) {
                if (handler.set) {
                    handler.set(target, key, val, undefined);
                } else {
                    target[key] = val;
                }
            }
        };
    }

    // create proxy object and configure it
    const proxy = {} as T;
    Object.defineProperties(proxy, configuration);

    if (handler.deleteProperty || handler.set) {
        let lastProps = Object.keys(proxy);
        let lastValue = lastProps + '';
        (function detectChanges() {
            setTimeout(detectChanges, 1000 / 60);

            const nextProps = Object.keys(proxy);
            const nextValue = nextProps + '';

            if (nextValue === lastValue) {
                return;
            }
            lastProps = nextProps;
            lastValue = nextValue;

            if (handler.deleteProperty) {
                lastProps
                    .filter(p => nextProps.indexOf(p) !== -1)
                    .forEach(key => {
                        handler.deleteProperty(target, key as any);
                    });
            }
            if (handler.set) {
                nextProps
                    .filter(p => lastProps.indexOf(p) !== -1)
                    .forEach(key => {
                        handler.set(target, key as any, target[key], undefined);
                    });
            }
        })();
    }

    return proxy;
}
