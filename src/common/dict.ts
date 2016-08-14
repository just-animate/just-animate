import {nada} from './resources';

declare const Map: IMapConstructor;
const isMappedSupported = !!Map;

export interface IMap<K, V> {
    size: number;
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, index: K, map: IMap<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    set(key: K, value?: V): this;
}

interface IMapConstructor {
    new (): IMap<any, any>;
    new <K, V>(entries?: [K, V][]): IMap<K, V>;
    prototype: IMap<any, any>;
}

export function createMap<T>(): T {
    return (isMappedSupported ? new Map() : Object.create(nada)) as T;
}
