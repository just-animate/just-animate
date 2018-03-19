import { IDLE } from '../_constants';
import { Dictionary } from './dict';
import { Timeline } from './timeline';

export const timelines = new Dictionary<Timeline>({}, (partial, set) => {
    for (let key in partial) {
        const last = timelines.get(key);
        if (last) {
            last.setState({ state: IDLE });
        }
        set(key, partial[key]);
    }
});
