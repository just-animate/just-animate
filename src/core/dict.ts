import { isDefined, keys } from './utils';
import { scheduler } from './scheduler';

export type Setter<T> = (key: string, value: T) => void;

export function dict<T>(
    initialValue?: Record<string, T>,
    onUpdate?: (properties: Record<string, T>, set: Setter<T>) => void
): ja.Dict<T> {
    onUpdate = onUpdate || defaultUpdater;

    let properties: Record<string, T> = {};
    const values: Record<string, T> = initialValue || {};

    const setter = (key: string, value: T) => {
        values[key] = value;
    };

    const propertyUpdated = scheduler(() => {
        const newProperties = properties;
        properties = {};
        onUpdate(newProperties, setter);
    });

    return {
        keys() {
            return keys(values);
        },
        set(key: string, value: T) {
            if (isDefined(key)) {
                properties[key] = value;
                propertyUpdated();
            }
        },
        get(key: string) {
            return values[key];
        },
        export() {
            return JSON.parse(JSON.stringify(values));
        },
        import(data: Record<string, T>) {
            onUpdate(data, setter);
        }
    };
}

function defaultUpdater<T>(values: Record<string, T>, setter: Setter<T>) {
    for (let key in values) {
        setter(key, values[key]);
    }
}
