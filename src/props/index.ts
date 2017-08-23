import { JustAnimatePlugin, Effect, AnimationController } from '../lib/types'
import { _ } from '../lib/constants'
import { interpolator } from '../lib/interpolate'
import { isDOM } from '../lib/inspect'
import { hyphenate } from '../lib/strings'
import { includes } from '../lib/lists'

const cssVarExp = /^\-\-[a-z0-9\-]+$/i
const viewbox = 'viewBox'

const svgReadonly = [viewbox]
const noHyphenate = [viewbox]

export const propsPlugin: JustAnimatePlugin = {
  name: 'props',
  animate(effect: Effect): AnimationController {
    const { target, prop } = effect
    const interpolate = interpolator(effect.to - effect.from, effect.keyframes)

    let propSetter: (value: any) => void

    // ignore attribute and variable setters if is not DOM or if the
    // target has a property with that exact name
    if (isDOM(target)) {
      if (cssVarExp.test(prop)) {
        propSetter = setVariable(effect.target, prop)
      } else if (typeof target[prop] !== 'undefined' && !includes(svgReadonly, prop)) {
        propSetter = setProperty(effect.target, prop)
      } else if (includes(noHyphenate, prop)) {
        propSetter = setAttribute(effect.target, prop)
      } else {
        propSetter = setAttributeHyphenate(effect.target, prop)
      }
    } else {
      propSetter = setProperty(effect.target, prop)
    }

    let initial = target[effect.prop]

    return {
      cancel(): void {
        if (initial !== _) {
          propSetter(initial)
        }
        initial = _
      },
      update(localTime: number, _playbackRate: number, _isActive: boolean): void {
        propSetter(interpolate(localTime))
      }
    }
  },
  getValue(target: HTMLElement, prop: string) {
    if (!isDOM(target) || typeof target[prop] !== 'undefined') {
      return target[prop]
    }
    if (cssVarExp.test(prop)) {
      return target.style.getPropertyValue(prop)
    }
    return target.getAttribute(hyphenate(prop))
  }
}

function setAttribute(target: HTMLElement, name: string) {
  return (value: any) => target.setAttribute(name, value)
}

function setAttributeHyphenate(target: HTMLElement, name: string) {
  const attName = hyphenate(name)
  return (value: any) => target.setAttribute(attName, value)
}

function setVariable(target: HTMLElement, name: string) {
  return (value: any) => {
    target.style.setProperty(name, value ? value + '' : '')
  }
}

function setProperty(target: {}, name: string) {
  return (value: any) => (target[name] = value)
}
