import * as types from '../types'
import { isNumber, isDOM } from '../utils/type'
import { forEach, includes, push, pushDistinct, head } from '../utils/lists'
import { _, CANCEL, FINISH, PAUSE, SEEK, UPDATE } from '../utils/resources'
import { abs, minMax, inRange } from '../utils/math'
import { lazy } from '../utils/utils'
import { $ } from '../utils/elements';

const TOLERANCE = 0.0001
const TRANSLATE = 'translate'
const PX = 'px'
const DEG = 'deg'
const X = 'X'
const Y = 'Y'
const Z = 'Z'
const RUNNING = 'running'
const TRANSFORM = 'transform'

// animatable length properties
const lengthProps = (`backgroundSize,border,borderBottom,borderBottomLeftRadius,borderBottomRightRadius,borderBottomWidth,borderLeft,borderLeftWidth,borderRadius,borderRight,borderRightWidth` +
  `,borderTop,borderTopLeftRadius,borderTopRightRadius,borderTopWidth,borderWidth,bottom,columnGap,columnRuleWidth,columnWidth,columns,flexBasis,font,fontSize,gridColumnGap,gridGap,gridRowGap` +
  `,height,left,letterSpacing,lineHeight,margin,marginBottom,marginLeft,marginRight,marginTop,maskSize,maxHeight,maxWidth,minHeight,minWidth,outline,outlineOffset,outlineWidth,padding,` +
  `paddingBottom,paddingLeft,paddingRight,paddingTop,perspective,right,shapeMargin,tabSize,top,width,wordSpacing`).split(
  ','
  )

const transformAngles = 'rotateX,rotateY,rotateZ,rotate'.split(',')
const transformScales = 'scaleX,scaleY,scaleZ,scale'.split(',')
const transformLengths = 'perspective,x,y,z'.split(',')
const transforms = transformAngles.concat(transformScales, transformLengths)

const aliases = {
  x: TRANSLATE + X,
  y: TRANSLATE + Y,
  z: TRANSLATE + Z
}

function fixUnits(effects: types.PropertyEffects) {
  // suffix lengths
  for (const propName in effects) {
    const prop = effects[propName]
    forEach(prop, (value, i) => {
      if (includes(lengthProps, propName) && isNumber(value.value)) {
        prop[i].value += PX
      }  
    })
  }
}

function handleTransforms(effects: types.PropertyEffects) {
  // handle transforms
  const transformEffects: {
    offset: number
    values: { name: string, value: string | number }[]
  }[] = []

  const transformNames: string[] = []
  const offsets: number[] = []

  for (const name in effects) {
    if (name !== TRANSFORM && !includes(transforms, name)) {
      continue
    }
    // add transform name to the list
    pushDistinct(transformNames, name)

    // pull transform prop and remove it from the effects
    const effectOptions = effects[name]
    effects[name] = _

    // append default unit if property requires one
    forEach(effectOptions, k => {
      // add offset to list of offsets
      pushDistinct(offsets, k.offset)

      // use an episilon so same frames aren't missed due to floating point issues
      const effect =
        head(transformEffects, t => abs(t.offset - k.offset) < TOLERANCE) ||
        push(transformEffects, {
          offset: k.offset,
          values: []
        })

      effect.values.push({
        name,
        value: k.value
      })
    })
  }

  if (!transformEffects.length) {
    return
  }

  offsets.sort()

  // apply transform effects to keyframes
  effects[TRANSFORM] = transformEffects.map(t => {
    let value = ''
    forEach(t.values, k => {
      const name = k.name
      if (name === TRANSFORM) {
        value = k.value + ''
        // break early
        return false
      }
      // convert each found values to transform functions and to list of effects
      let propValue = k.value
      if (includes(transformLengths, name) && isNumber(propValue)) {
        propValue += PX
      } else if (includes(transformAngles, name) && isNumber(propValue)) {
        propValue += DEG
      }
      value += `${aliases[name] || name}(${propValue})`
      return _
    })

    return {
      offset: t.offset,
      value
    }
  })
}

function animateEffect(effect: types.Effect): types.AnimationController {
  const { keyframes, from, to, target } = effect
  const getAnimator = lazy(() => {
    const a = (target as any).animate(keyframes, {
      duration: to - from,
      fill: 'both'
    })
    a.pause()
    return a
  })

  return (type: string, time: number, playbackRate: number) => {
    const animator = getAnimator()

    if (animator.playbackRate !== playbackRate) {
      // set playbackRate direction/speed
      animator.playbackRate = playbackRate
    }

    if (type === CANCEL) {
      animator.cancel()
      return
    }
    if (type === FINISH) {
      // without pause() WAAPI appears to play the animation again on seek
      animator.finish()
      animator.pause()
      return
    }

    if (type === PAUSE) {
      animator.pause()
    }

    const isForwards = (playbackRate || 0) >= 0
    const duration = to - from
    const currentTime = (time !== _ ? time : isForwards ? 0 : duration) - from
    if (type === PAUSE || type === SEEK) {
      // sync if paused or seeking
      animator.currentTime = minMax(currentTime, 0, duration)
    }

    if (
      type === UPDATE &&
      animator.playState !== RUNNING &&
      inRange(currentTime * (isForwards ? 1 : -1), 0, duration)
    ) {
      // sync time
      animator.currentTime = minMax(currentTime, 0, duration)

      // start if ticking and animator is not running
      animator.play()
    }
  }
}

export const waapiPlugin: types.Plugin = {
  animate(effects, animations) {
    forEach(
      effects,
      effect => {
        isDOM(effect.target) && push(animations, animateEffect(effect))
      }
    )
  },
  resolve(selector: string) {
    return $(document, selector)
  },
  transform(target, effects) {
    if (isDOM(target.target)) {
      fixUnits(effects)
      handleTransforms(effects)
    }
  }
}
