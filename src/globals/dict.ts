import { Dict } from '../types'; 
const JA = window.JA;

export type Setter<T> = (key: string, value: T) => void;

export function dict<T>(
    onUpdate: (properties: Record<string, T>, set: Setter<T>) => void
): Dict<T> {
    let properties: Record<string, T> = {};
    const values: Record<string, T> = {};

    const setter = (key: string, value: T) => {
        values[key] = value;
    };

    const propertyUpdated = window.JA.scheduler(() => {
        const newProperties = properties;
        properties = {};
        onUpdate(newProperties, setter);
    });

    return {
        keys() {
            return Object.keys(values);
        },
        set(key: string, value: T) {
            if (JA.utils.isDefined(key)) {
                properties[key] = value;
                propertyUpdated();
            }
        },
        get(key: string) {
            return values[key];
        }
    };
}

JA.dict = dict;

declare module '../types' {
    interface JustAnimateStatic {
        dict: typeof dict;
    }
}
