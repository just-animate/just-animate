import { waapiPlugin } from './index'

// configure plugin
if (typeof window !== 'undefined' && typeof (window as any).just !== 'undefined') {
  // tslint:disable-next-line:no-string-literal
  (window as any).just.addPlugin(waapiPlugin)
} else {
  require('just-animate').addPlugin(waapiPlugin)
}
