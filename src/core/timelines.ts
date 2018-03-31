import { types } from './types'; 
import { ObservableProxy } from './observable-proxy';
import { Timeline } from './timeline'; 

export const timelines: types.ObservableProxy<Timeline> = ObservableProxy();
