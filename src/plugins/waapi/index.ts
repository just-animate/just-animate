import { Plugin } from '../../types'
import { isDOM } from '../../utils/type'
import { push } from '../../utils/lists'
import { $ } from '../../utils/elements'
import { animateEffect } from './animate'
import { appendUnits } from './append-units';
import { combineTransforms } from './combine-transforms'

export const waapiPlugin: Plugin = {
  animate(effect, animations) {
    if (isDOM(effect.target)) {
      push(animations, animateEffect(effect))
    }
  },
  resolve(selector: string) {
    return $(document, selector)
  },
  transform(target, effects) {
    if (isDOM(target.target)) {
      appendUnits(effects)
      combineTransforms(effects)
    }
  }
}
