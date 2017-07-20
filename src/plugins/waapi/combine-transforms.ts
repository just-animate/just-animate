import { PropertyEffects } from '../../types';
import { includes, pushDistinct, forEach, head, push } from '../../utils/lists';
import { _ } from '../../utils/resources';
import { abs } from '../../utils/math';
import { isNumber } from '../../utils/type';
import { TRANSFORM, transforms, transformLengths, transformAngles, PX, DEG, aliases, TOLERANCE } from './constants';

export function combineTransforms(effects: PropertyEffects) {
  // handle transforms
  const transformEffects: {
    offset: number
    values: { name: string; value: string | number }[]
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
