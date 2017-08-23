import { waapiPlugin } from './index'

declare const window: Window & { just: any };

// configure plugin
if (typeof window !== 'undefined' && typeof (window as any).just !== 'undefined') {
  // tslint:disable-next-line:no-string-literal
  window.just.addPlugin(waapiPlugin)
} else {
  require('just-animate').addPlugin(waapiPlugin)
}
