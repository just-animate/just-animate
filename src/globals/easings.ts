import '../types';
const JA = window.JA;

export const easings = JA.dict<{}>((partial, set) => {
    for (let key in partial) {
        set(key, partial[key]);
    }
}); 

JA.easings = easings;

declare module '../types' {
    interface JustAnimateStatic {
        easings: typeof easings;
    }
}
