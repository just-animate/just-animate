import { JustAnimatePlugin } from '../lib/types'
import { isDOM } from '../lib/inspect'
import { animate } from './animate'
import { appendUnits } from './append-units';
import { combineTransforms } from './transforms'

export const waapiPlugin: JustAnimatePlugin = {
  name: 'web',
  animate,
  getValue(target: HTMLElement, key: string) {
    return getComputedStyle(target)[key]
  },
  onWillAnimate(target, effects) {
    if (isDOM(target.target)) {
      appendUnits(effects)
      combineTransforms(target, effects)
    }
  }
}
