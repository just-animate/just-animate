import { dict } from './dict';

export const easings = dict<{}>((partial, set) => {
    for (let key in partial) {
        set(key, partial[key]);
    }
}); 
