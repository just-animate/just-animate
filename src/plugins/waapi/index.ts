import { Plugin } from '../../types'
import { isDOM } from '../../utils/type'
import { push, includes } from '../../utils/lists'
import { $ } from '../../utils/elements'
import { animateEffect } from './animate'
import { appendUnits } from './append-units';
import { cssProps } from './constants';
import { combineTransforms } from './combine-transforms'

export const waapiPlugin: Plugin = {
  animate(effect, animations) {
    if (isDOM(effect.target) && includes(cssProps, effect.prop)) {
      push(animations, animateEffect(effect))
      return true;
    }
    return false;
  },
  resolve(selector: string) {
    return $(document, selector)
  },
  transform(target, effects) {
    if (isDOM(target.target)) {
      appendUnits(effects)
      combineTransforms(target, effects)
    }
  }
}
