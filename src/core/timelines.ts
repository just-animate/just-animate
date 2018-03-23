import { types } from './types';
import { IDLE } from '../_constants';
import { ObservableProxy } from './observable-proxy';
import { Timeline } from './timeline'; 

export const timelines: types.ObservableProxy<Timeline> = ObservableProxy();

timelines.subscribe(props => {
    props.forEach(prop => {
        const last = timelines[prop];
        if (last) {
            last.setState({ state: IDLE });
        }
    })
});
