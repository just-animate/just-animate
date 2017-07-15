import * as types from '../types'
import { resolveProperty } from '../transformers'
import { getPlugins } from './plugins'
import { fromAll, indexOf, push } from '../utils/lists'
import { isDefined } from '../utils/type'
import { convertToMs } from '../utils/units'
import { flr } from '../utils/math'

export function toEffects(
  configs: types.TargetConfiguration[]
): types.Effect[] {
  const result: types.Effect[] = []

  fromAll(configs, targetConfig => {
    const { from, to, duration, keyframes, target } = targetConfig

    // construct property animation options
    var effects: types.PropertyEffects = {}
    fromAll(keyframes, p =>
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
    fromAll(
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
  const staggerMs = convertToMs(
    resolveProperty(options.stagger, target, index, true) || 0
  )
  const delayMs = convertToMs(
    resolveProperty(options.delay, target, index) || 0
  )
  const endDelayMs = convertToMs(
    resolveProperty(options.endDelay, target, index) || 0
  )

  // todo: incorporate WAAPI delay/endDelay
  const from = staggerMs + delayMs + options.from
  const to = staggerMs + delayMs + options.to + endDelayMs
  const duration = to - from

  fromAll(css, keyframe => {
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
  for (var name in keyframe) {
    if (name === 'offset') {
      continue
    }

    var value = keyframe[name] as string | number
    if (!isDefined(value)) {
      continue
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
      order: 0, // fixme
      value
    })
  }
}
