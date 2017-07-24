import { Plugin, AnimationTarget } from '../../types'
import { isDOM } from '../../utils/type'
import { push, includes } from '../../utils/lists'
import { $ } from '../../utils/elements'
import { animateEffect } from './animate'
import { appendUnits } from './append-units';
import { cssProps } from './constants';
import { combineTransforms } from './combine-transforms'

export const waapiPlugin: Plugin = {
  animate(effect, animations) {
    push(animations, animateEffect(effect))
  },
  isHandled(target: AnimationTarget, propName: string) {
    return isDOM(target) && includes(cssProps, propName)
  },
  getValue(target: HTMLElement, key: string) {
    return getComputedStyle(target)[key]
  },
  getTargets(selector: string) {
    return $(document, selector)
  },
  onWillAnimate(target, effects) {
    if (isDOM(target.target)) {
      appendUnits(effects)
      combineTransforms(target, effects)
    }
  }
}
