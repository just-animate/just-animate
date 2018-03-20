import { isDefined } from './utils';
import { Observable } from './observable';
import { scheduler } from './scheduler';
import { types } from './types';

export class Dictionary<T> implements types.IDictionary<T> {
    public change: types.IObservable<Record<string, T>>;

    private onPropertyUpdated: any;
    private values: Record<string, T>;
    private nextValues: Record<string, T>;

    constructor(values?: Record<string, T>) {
        const self = this;
        self.change = new Observable();

        self.onPropertyUpdated = scheduler(() => {
            const newProperties = self.nextValues;
            self.nextValues = {};
            self.import(newProperties);
        });
        self.values = {}
        self.nextValues = values || {};
        self.onPropertyUpdated();
    }

    public keys(): string[] {
        return Object.keys(this.values);
    }
    public set(key: string, value: T) {
        if (isDefined(key)) {
            this.nextValues[key] = value;
            this.onPropertyUpdated();
        }
    }
    public get(key: string): T {
        return this.values[key];
    }
    public export(): Record<string, T> {
        return JSON.parse(JSON.stringify(this.values));
    }
    public import(data: Record<string, T>): void {
        this.change.next(data);
        for (let key in data) {
            this.values[key] = data[key];
        }
    }
}
