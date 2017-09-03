import { PropertyEffects, TargetConfiguration, PropertyEffect, Dictionary } from '../lib/types'
import { includes, pushDistinct, all, find } from '../lib/lists'
import { _ } from '../lib/constants'
import { TRANSFORM, transforms, aliases, PX, transformAngles, DEG, transformLengths } from './constants'
import { isDefined } from '../lib/inspect'
import { parseUnit } from './parse-unit'

export function combineTransforms(
  target: TargetConfiguration,
  effects: PropertyEffects,
  propToPlugin: Dictionary<string>
) {
  // get all transform shorthands
  const transformNames = target.propNames.filter(t => includes(transforms, t))
  if (!transformNames.length) {
    return
  }

  if (includes(target.propNames, TRANSFORM)) {
    // disallow mixing tranform with shorthand properties
    throw new Error('transform + shorthand is not allowed')
  }

  // get a list of offsets
  const offsets: number[] = []
  const easings: { [offset: string]: string } = {}

  all(transformNames, name => {
    const effects2 = effects[name]
    if (effects2) {
      all(effects2, effect => {
        easings[effect.offset] = effect.easing
        pushDistinct(offsets, effect.offset)
      })
    }
  })

  // put offsets in numerical order
  offsets.sort()

  // create effects for each transform function at each offset
  // this should guarantee transforms are processed in the order that they are observed
  // from the original properties or keyframes
  const transformEffects = offsets.map(offset => {
    // create effect
    const values = {} as { [name: number]: string | number }
    all(transformNames, name => {
      const effect = find(effects[name], e => e.offset === offset)
      values[name] = effect ? effect.value : _
    })

    return {
      offset,
      easing: easings[offset],
      values
    }
  })

  // fill in gaps in keyframes
  const len = transformEffects.length
  for (let i = len - 1; i > -1; --i) {
    const effect = transformEffects[i]

    // foreach keyframe if has transform property
    for (const transform in effect.values) {
      let value = effect.values[transform]
      if (isDefined(value)) {
        continue
      }

      // find first value in range
      let startingPos: number = _
      for (var j = i - 1; j > -1; j--) {
        if (isDefined(transformEffects[j].values[transform])) {
          startingPos = j
          break
        }
      }

      // find next value in range
      let endingPos: number = _
      for (var k = i + 1; k < len; k++) {
        if (isDefined(transformEffects[k].values[transform])) {
          endingPos = k
          break
        }
      }

      // determine which values were found
      const startingPosFound = startingPos !== _
      const endingPosFound = endingPos !== _
      if (startingPosFound && endingPosFound) {
        // if both start and end are found, fill the value based on the relative offset
        const startEffect = transformEffects[startingPos]
        const endEffect = transformEffects[endingPos]
        const startVal = parseUnit(startEffect.values[transform])
        const endVal = parseUnit(endEffect.values[transform])

        for (let g = startingPos + 1; g < endingPos; g++) {
          const currentOffset = offsets[g]

          // calculate offset delta (how much animation progress to apply)
          const offsetDelta = (currentOffset - startEffect.offset) / (endEffect.offset - startEffect.offset)
          const currentValue = startVal.value + (endVal.value - startVal.value) * offsetDelta

          const currentValueWithUnit = currentValue + (endVal.unit || startVal.unit || '')
          const currentKeyframe = transformEffects[g]
          currentKeyframe.values[transform] = currentValueWithUnit
        }
      } else if (startingPosFound) {
        // if either start or end was not found, fill from the last known position
        for (let g = startingPos + 1; g < len; g++) {
          transformEffects[g].values[transform] = transformEffects[startingPos].values[transform]
        }
      }
    }
  }

  if (transformEffects.length) {
    // remove transform shorthands
    all(transformNames, name => {
      effects[name] = _
    })

    const transformEffects2: PropertyEffect[] = []
    all(transformEffects, effect => {
      let val: string = _
      for (var prop in effect.values) {
        const unit = parseUnit(effect.values[prop])
        if (unit.value === _) {
          continue
        }
        if (!unit.unit) {
          unit.unit = includes(transformLengths, prop) ? PX : includes(transformAngles, prop) ? DEG : ''
        }

        val = (val ? val + ' ' : '') + (aliases[prop] || prop) + '(' + unit.value + unit.unit + ')'
      }
      transformEffects2.push({
        offset: effect.offset,
        value: val,
        easing: effect.easing,
        interpolate: _
      })
    })

    effects[TRANSFORM] = transformEffects2
    propToPlugin[TRANSFORM] = 'web'
  }
}
