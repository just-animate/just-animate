import { ITimeline } from '../types';
import { IDLE } from '../_constants';

const JA = window.JA;

export const timelines = JA.dict<ITimeline>((partial, set) => {
    for (let key in partial) {
        const last = JA.timelines.get(key);
        if (last) {
            last.setState({ state: IDLE });
        }
        set(key, partial[key]);
    }
});

window.JA.timelines = timelines;

declare module '../types' {
    interface JustAnimateStatic {
        timelines: typeof timelines;
    }
}
