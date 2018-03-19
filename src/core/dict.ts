import { isDefined, keys } from './utils';
import { scheduler } from './scheduler';

export type Setter<T> = (key: string, value: T) => void;
export type UpdateHandler<T> = (
    properties: Record<string, T>,
    set: Setter<T>
) => void;

export class Dictionary<T> {
    private updateHandler: (properties: Record<string, T>, set: Setter<T>) => void;
    private onPropertyUpdated: any;
    private values: Record<string, T>;
    private nextValues: Record<string, T>;

    constructor(values?: Record<string, T>, updateHandler?: UpdateHandler<T>) {
        const self = this;
        self.values = values || {};
        self.updateHandler = updateHandler || defaultUpdater;

        self.onPropertyUpdated = scheduler(() => {
            const newProperties = this.nextValues;
            this.nextValues = {};
            updateHandler(newProperties, self._setter);
        });
    }

    public keys() {
        return keys(this.values);
    }
    public set(key: string, value: T) {
        if (isDefined(key)) {
            this.nextValues[key] = value;
            this.onPropertyUpdated();
        }
    }
    public get(key: string) {
        return this.values[key];
    }
    public export() {
        return JSON.parse(JSON.stringify(this.values));
    }
    public import(data: Record<string, T>) {
        this.updateHandler(data, this._setter);
    }

    private _setter = (key: string, value: T) => {
        this.values[key] = value;
    };
}

function defaultUpdater<T>(values: Record<string, T>, setter: Setter<T>) {
    for (let key in values) {
        setter(key, values[key]);
    }
}
