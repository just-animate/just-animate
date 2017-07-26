import { Plugin, AnimationTarget } from '../lib/types'
import { isDOM } from '../lib/inspect'
import { includes } from '../lib/lists'
import { animate } from './animate'
import { appendUnits } from './append-units';
import { cssProps } from './constants';
import { combineTransforms } from './transforms'

export const waapiPlugin: Plugin = {
  animate,
  isHandled(target: AnimationTarget, propName: string) {
    return isDOM(target) && includes(cssProps, propName)
  },
  getValue(target: HTMLElement, key: string) {
    return getComputedStyle(target)[key]
  },
  getTargets(selector: string) {
    return Array.prototype.slice.call(
      document.querySelectorAll(selector)
    )
  },
  onWillAnimate(target, effects) {
    if (isDOM(target.target)) {
      appendUnits(effects)
      combineTransforms(target, effects)
    }
  }
}
