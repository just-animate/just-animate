import { dict } from './dict';

export const refs = dict<{}>((partial, set) => {
    for (let key in partial) {
        set(key, partial[key]);
    }
});
