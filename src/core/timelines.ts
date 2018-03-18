import { IDLE } from '../_constants';
import { dict } from './dict';

export const timelines = dict<ja.ITimeline>({}, (partial, set) => {
    for (let key in partial) {
        const last = timelines.get(key);
        if (last) {
            last.setState({ state: IDLE });
        }
        set(key, partial[key]);
    }
});
