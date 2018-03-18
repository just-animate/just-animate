import { isDefined, keys } from './utils'; 
import { scheduler } from './scheduler';

export type Setter<T> = (key: string, value: T) => void;

export function dict<T>(
    onUpdate: (properties: Record<string, T>, set: Setter<T>) => void
): ja.Dict<T> {
    let properties: Record<string, T> = {};
    const values: Record<string, T> = {};

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
        }
    };
}
