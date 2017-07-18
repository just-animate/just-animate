import * as types from '../types'
import { resolveProperty } from '../transformers'
import { getPlugins } from './plugins'
import { forEach, indexOf, push } from '../utils/lists'
import { isDefined } from '../utils/type'
import { flr, max } from '../utils/math'

export function toEffects(
  configs: types.TargetConfiguration[]
): types.Effect[] {
  const result: types.Effect[] = []

  forEach(configs, targetConfig => {
    const { from, to, duration, keyframes, target } = targetConfig

    // construct property animation options
    var effects: types.PropertyEffects = {}
    forEach(keyframes, p =>
      push(
        // get or create property effect
        effects[p.prop] || (effects[p.prop] = []),
        {
          // calculate offset based on duration and start time
          offset: (p.time - from) / (duration || 1),
          // get property value
          value: resolveProperty(p.value, target, p.index)
        }
      )
    )

    // process handlers
    forEach(
      getPlugins(),
      plugin => plugin.transform && plugin.transform(targetConfig, effects)
    )

    for (var propName in effects) {
      var effect = effects[propName]
      if (effect) {
        // remap the keyframes field to remove multiple values
        // add to list of Effects
        result.push({
          target,
          from,
          to,
          keyframes: effect.map(({ offset, value }) => ({
            offset,
            [propName]: value
          }))
        })
      }
    }
  })

  return result
}

export function addKeyframes(
  target: types.TargetConfiguration,
  index: number,
  options: types.AnimationOptions
) {
  const { css } = options 
  const staggerMs = (options.stagger && options.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(options.delay, target, index) || 0
  const from = max(staggerMs + delayMs + options.from, 0)
  const duration = options.to - options.from

  forEach(css, keyframe => {
    addKeyframe(target, flr(duration * keyframe.offset + from), index, keyframe)
  })
}

function addKeyframe(
  target: types.TargetConfiguration,
  time: number,
  index: number,
  keyframe: types.KeyframeOptions
) {
  var { keyframes } = target
  var count = -1
  for (var name in keyframe) {
    if (name === 'offset') {
      continue
    }

    var value = keyframe[name] as string | number
    if (!isDefined(value)) {
      continue
    }

    var propIndex = target.propNames.indexOf(name)
    if (propIndex === -1) {
      target.propNames.push(name)
    }

    var indexOfFrame = indexOf(
      keyframes,
      k => k.prop === name && k.time === time
    )
    if (indexOfFrame !== -1) {
      keyframes[indexOfFrame].value = value
      continue
    }

    keyframes.push({
      index,
      prop: name,
      time,
      order: ++count,
      value
    })
  }
}
