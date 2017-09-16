import { JustAnimatePlugin } from '../lib/core/types'
import { isDOM } from '../lib/utils/inspect'
import { animate } from './animate'
import { appendUnits } from './append-units'
import { combineTransforms } from './transforms'

export const waapiPlugin: JustAnimatePlugin = {
  name: 'web',
  animate,
  getValue(target: HTMLElement, key: string) {
    return getComputedStyle(target)[key]
  },
  onWillAnimate(target, effects, propToPlugin) {
    if (isDOM(target.target)) {
      appendUnits(effects)
      combineTransforms(target, effects, propToPlugin)
    }
  }
}
