import * as types from '../types'
import {
  _,
  isDOM,
  isNumber,
  includes,
  indexOf,
  inRange,
  lazy,
  minMax,
  RUNNING,
  CANCEL,
  PAUSE,
  FINISH,
  SEEK,
  TRANSFORM,
  UPDATE
} from '../utils'

const TOLERANCE = 0.0001
const PADDING = 0
const PERSPECTIVE = 'perspective'
const ROTATE = 'rotate'
const SCALE = 'scale'
const TRANSLATE = 'translate'
const PX = 'px'
const DEG = 'deg'
const X = 'X'
const Y = 'Y'
const Z = 'Z'

// animatable length properties
const lengthProps = (`backgroundSize,border,borderBottom,borderBottomLeftRadius,borderBottomRightRadius,borderBottomWidth,borderLeft,borderLeftWidth,borderRadius,borderRight,borderRightWidth` +
  `,borderTop,borderTopLeftRadius,borderTopRightRadius,borderTopWidth,borderWidth,bottom,columnGap,columnRuleWidth,columnWidth,columns,flexBasis,font,fontSize,gridColumnGap,gridGap,gridRowGap` +
  `,height,left,letterSpacing,lineHeight,margin,marginBottom,marginLeft,marginRight,marginTop,maskSize,maxHeight,maxWidth,minHeight,minWidth,outline,outlineOffset,outlineWidth,padding,` +
  `paddingBottom,paddingLeft,paddingRight,paddingTop,perspective,right,shapeMargin,tabSize,top,width,wordSpacing`).split(
  ','
)

const transformAngles = [ROTATE + X, ROTATE + Y, ROTATE + Z, ROTATE]
const transformScales = [SCALE + X, SCALE + Y, SCALE + Z, SCALE]
const transformLengths = [PERSPECTIVE, 'x', 'y', 'z']
const transforms = transformAngles.concat(transformScales, transformLengths)

const aliases = {
  x: TRANSLATE + X,
  y: TRANSLATE + Y,
  z: TRANSLATE + Z
}

function fixUnits(effects: types.PropertyEffects) {
  // suffix lengths
  for (const propName in effects) {
    const keyframes = effects[propName]
    const value = keyframes[propName]
    if (includes(lengthProps, propName) && isNumber(value)) {
      keyframes[propName] = value + 'px'
    }
  }
}

function handleTransforms(effects: types.PropertyEffects) {
  // handle transforms
  const transformEffects: {
    offset: number
    value: string
  }[] = []

  for (var name in effects) {
    if (name !== TRANSFORM && !includes(transforms, name)) {
      continue
    }

    // pull transform prop and remove it from the effects
    const effectOptions = effects[name]
    effects[name] = _

    // append default unit if property requires one
    for (var i = 0, ilen = effectOptions.length; i < ilen; i++) {
      var k = effectOptions[i]
      // use an episilon so same frames aren't missed due to floating point issues
      var index = indexOf(
        transformEffects,
        t => Math.abs(t.offset - k.offset) < TOLERANCE
      )

      // create or find an existing effect at the offset
      const effect =
        index !== -1
          ? transformEffects[index]
          : {
              offset: k.offset,
              value: ''
            }

      if (index === -1) {
        transformEffects.push(effect)
      }

      if (name === TRANSFORM) {
        // take transform at face value, override all other values
        effect.value = k.value + ''
      } else {
        // convert each found values to transform functions and to list of effects
        let value = k.value
        if (includes(transformLengths, name) && isNumber(value)) {
          value += PX
        } else if (includes(transformAngles, name) && isNumber(value)) {
          value += DEG
        }
        effect.value += `${aliases[name] || name}(${value})`
      }
    }
  }

  if (transformEffects.length) {
    // apply transform effects to keyframes
    effects[TRANSFORM] = transformEffects
  }
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

    if (type === UPDATE && animator.playState !== RUNNING) {
      const sign = isForwards ? 1 : -1
      const isActive = inRange(currentTime + PADDING * sign, 0, duration)

      if (isActive) {
        // sync time
        animator.currentTime = minMax(currentTime, 0, duration)

        // start if ticking and animator is not running
        animator.play()
      }
    }
  }
}

export const waapiPlugin: types.Plugin = {
  animate(effects: types.Effect[], animations: types.AnimationController[]) {
    for (var i = 0, ilen = effects.length; i < ilen; i++) {
      var effect = effects[i]
      if (isDOM(effect.target)) {
        animations.push(animateEffect(effect))
      }
    }
  },
  transform(
    _target: types.TargetConfiguration,
    effects: types.PropertyEffects
  ) {
    fixUnits(effects)
    handleTransforms(effects)
  }
}
