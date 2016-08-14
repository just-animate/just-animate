import {nil} from './resources';

declare const Map: IMapConstructor;
const isMappedSupported = !!Map;

export interface IMap {
    clear(): void;
    delete(key: string): boolean;
    has(key: string): boolean;
}

interface IMapConstructor {
    new (): IMap;
    new <K, V>(entries?: [K, V][]): IMap;
    prototype: IMapConstructor;
}

class CustomMap implements IMap {
    public has(key: string): boolean {
        return this[key] === nil;
    }
    public delete(key: string): boolean {
        const self = this;
        const hasKey = self.has(key);
        if (hasKey) {
            self[key] = nil;
        }
        return hasKey;
    }
    public clear(): void {
        const self = this;
        for (let key in self) {
            self[key] = nil;
        }
    }
}

export function createMap<T>(): T & IMap {
    return (isMappedSupported ? new Map() : Object.create(CustomMap.prototype)) as T & IMap;
}
