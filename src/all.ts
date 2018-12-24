import { addPlugin } from './lib/core/plugins';
import { waapiPlugin } from './web';

export * from './main';

addPlugin(waapiPlugin);
