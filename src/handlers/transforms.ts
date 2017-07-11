import * as types from '../types'
import { TRANSFORM, isNumber, includes, _, indexOf } from '../utils';

const TOLERANCE = 0.0001

const perspective = 'perspective'
const rotate = 'rotate'
const scale = 'scale'
const translate = 'translate'
const px = 'px'
const deg = 'deg'

const X = 'X'
const Y = 'Y'
const Z = 'Z'

const angles = [
  rotate + X,
  rotate + Y,
  rotate + Z,
  rotate
]

const scales = [
  scale + X,
  scale + Y,
  scale + Z,
  scale
]

const lengths = [
  perspective,
  'x',
  'y',
  'z'
]

const transforms = angles.concat(scales, lengths)

const aliases = {
  x: translate + X,
  y: translate + Y,
  z: translate + Z
}

export const transformHandler = (_target: types.TargetConfiguration, effects: types.PropertyEffects) => {
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
      var index = indexOf(transformEffects, t => Math.abs(t.offset - k.offset) < TOLERANCE)

      // create or find an existing effect at the offset
      const effect = index !== -1
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
        if (includes(lengths, name) && isNumber(value)) {
          value += px
        } else if (includes(angles, name) && isNumber(value)) {
          value += deg
        }
        effect.value += `${(aliases[name] || name)}(${value})`
      }
        
    }
  }

  if (transformEffects.length) {
    // apply transform effects to keyframes
    effects[TRANSFORM] = transformEffects
  }
}
