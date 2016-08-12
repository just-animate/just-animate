declare const Map: IMapConstructor;

const global = window;
const requestAnimationFrame = global.requestAnimationFrame;
const isMappedSupported = !!Map;

export const now = (performance && performance.now)
    ? () => performance.now()
    : () => Date.now();

export const raf = (requestAnimationFrame)
    ? (ctx: any, fn: Function) => {
        requestAnimationFrame(() => { fn(ctx); });
    }
    : (ctx: any, fn: Function) => {
        setTimeout(() => { fn(ctx); }, 16.66);    
    };

export function dict(it: any): IDict {
    return isMappedSupported ? new Map() : {};
}

export interface IDict {
    [key: string]: any;
}

interface IMap<K, V> {
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
