import { types } from './types';
import { ObservableProxy } from './observable-proxy'; 

export const refs: types.ObservableProxy<{}> = ObservableProxy();
