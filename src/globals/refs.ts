import { Dict } from '../types';
const JA = window.JA;

export const refs = JA.dict<{}>((partial, set) => {
    for (let key in partial) {
        set(key, partial[key]);
    }
});

JA.refs = refs;

declare module '../types' {
    interface JustAnimateStatic {
        refs: Dict<{}>;
    }
}
