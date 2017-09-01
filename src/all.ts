import { addPlugin } from './lib/plugins'
import { waapiPlugin } from './web'

export * from './main'
export * from './props'
export * from './extras'

addPlugin(waapiPlugin)
