import * as types from '../types'
import { isNumber, isDOM } from '../utils/type'
import { fromAll, includes, indexOf, push } from '../utils/lists'
import { _, CANCEL, FINISH, PAUSE, SEEK, UPDATE } from '../utils/resources'
import { abs, minMax, inRange } from '../utils/math'
import { lazy } from '../utils/utils'

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
    const keyframes = effects[propName]
    const value = keyframes[propName]
    if (includes(lengthProps, propName) && isNumber(value)) {
      keyframes[propName] = value + PX
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
    fromAll(effectOptions, k => {
      // use an episilon so same frames aren't missed due to floating point issues
      var index = indexOf(
        transformEffects,
        t => abs(t.offset - k.offset) < TOLERANCE
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
        push(transformEffects, effect)
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
    })
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
    fromAll(
      effects,
      effect => isDOM(effect.target) && push(animations, animateEffect(effect))
    )
  },
  transform(_target, effects) {
    fixUnits(effects)
    handleTransforms(effects)
  }
}
