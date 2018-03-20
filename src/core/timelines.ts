import { IDLE } from '../_constants';
import { Dictionary } from './dict';
import { Timeline } from './timeline';
import { types } from './types';

export const timelines: types.IDictionary<Timeline> = new Dictionary();

timelines.change.subscribe(partial => {
    for (let key in partial) {
        const last = timelines.get(key);
        if (last) {
            last.setState({ state: IDLE });
        }
    }
});
