import { AnimationOptions, Effect, PropertyEffects, PropertyResolver, PropertyValue, TargetConfiguration, PropertyObject, JustAnimatePlugin } from './types'
import { resolveProperty } from './resolve-property'
import { forEach, indexOf, list, head, tail, pushDistinct, push } from './lists'
import { isDefined, isObject, isNumber } from './inspect'
import { flr, max } from './math'
import { _ } from './constants';

export function toEffects(plugin: JustAnimatePlugin, configs: TargetConfiguration[]): Effect[] {
  const result: Effect[] = []

  forEach(configs, targetConfig => {
    const { from, to, duration, keyframes, target, targetLength } = targetConfig

    // construct property animation options
    var effects: PropertyEffects = {}
    forEach(keyframes, p => {
      const effect2 = (effects[p.prop] || (effects[p.prop] = {}))
      const offset = (p.time - from) / (duration || 1)
      const value2 = resolveProperty(p.value, target, p.index, targetLength)
      effect2[offset] = value2
    })

    // process handlers
    if (plugin.onWillAnimate) {
      plugin.onWillAnimate(targetConfig, effects)
    }

    for (var prop in effects) {
      var effect = effects[prop]
      if (effect) {
        // remap the keyframes field to remove multiple values
        // add to list of Effects
        const effectKeyframes = Object.keys(effect)
          .map(e => +e)
          .sort()
          .map(e => ({
            offset: e,
            value: effect[e]
          }))

        const firstFrame = head(effectKeyframes, c => c.offset === 0)
        if (firstFrame === _ || firstFrame.value === _) {
          // add keyframe if offset 0 is missing
          var value = plugin.getValue(target, prop)
          if (firstFrame === _) {
            effectKeyframes.splice(0, 0, {
              offset: 0,
              value: value
            })
          } else {
            firstFrame.value = value
          }
        }

        push(result, {
          plugin: plugin.name,
          target,
          prop,
          from,
          to,
          keyframes: effectKeyframes
        })
      }
    }
  })

  return result
}

export function addPropertyKeyframes(
  pluginName: string,
  target: TargetConfiguration,
  index: number,
  options: AnimationOptions
) {
  const props = options[pluginName]
  const staggerMs = (options.stagger && options.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(options.delay, target, index, target.targetLength) || 0
  const from = max(staggerMs + delayMs + options.from, 0)
  const duration = options.to - options.from

  // iterate over each property split it into keyframes
  for (var name in props) {
    if (props.hasOwnProperty(name)) {
      addProperty(target, index, name, props[name], duration, from)
    }
  }
}

function addProperty(
  target: TargetConfiguration,
  index: number,
  name: string,
  val: PropertyResolver<PropertyValue> | PropertyResolver<PropertyValue>[],
  duration: number,
  from: number
) {
  // skip undefined options
  if (!isDefined(val)) {
    return
  }

  // add property to list of properties
  pushDistinct(target.propNames, name)

  // resolve options to keyframes
  const keyframes = list(val).map((v, i, vals) => {
    const valOrObj = resolveProperty(v, target.target, index, target.targetLength)
    const valObj = valOrObj as PropertyObject
    const isObj2 = isObject(valOrObj)

    const value = isObj2 ? valObj.value : valOrObj as string | number

    const offset = isObj2 && isNumber(valObj.offset)
      // object has an explicit offset  
      ? valObj.offset
      : i === vals.length - 1
        // last in array is offset: 1       
        ? 1
        : i === 0
          // first in the array is offset: 0
          ? 0
          : _;

    const easing = valObj.easing || 'linear'

    return { offset, value, easing }
  })

  // insert offsets where not present
  inferOffsets(keyframes)

  keyframes.forEach(keyframe => {
    const { offset, value } = keyframe
    const time = flr(duration * offset + from)
    const indexOfFrame = indexOf(target.keyframes, k => k.prop === name && k.time === time)

    if (indexOfFrame !== -1) {
      keyframes[indexOfFrame].value = value
      return
    }

    push(target.keyframes, {
      index,
      prop: name,
      time,
      value
    })
  })

  // insert start frame if not present
  if (!head(target.keyframes, k => k.prop === name && k.time === from)) {
    push(target.keyframes, {
      index,
      prop: name,
      time: from,
      value: _
    })
  }

  // insert start frame if not present
  var to = from + duration
  if (!tail(target.keyframes, k => k.prop === name && k.time === to)) {
    push(target.keyframes, {
      index,
      prop: name,
      time: to,
      value: _
    })
  }
}

function inferOffsets(keyframes: PropertyObject[]) {
  if (!keyframes.length) {
    return
  }

  // search for offset 0 or assume it is the first one in the list
  const first = head(keyframes, k => k.offset === 0) || keyframes[0]
  if (!isDefined(first.offset)) {
    // if no offset is set on first keyframe, it is assumed to be 0
    first.offset = 0
  }

  // search for offset 1 or assume it is the last one in the list
  const last = tail(keyframes, k => k.offset === 1) || keyframes[keyframes.length - 1]
  if (keyframes.length > 1 && !isDefined(last.offset)) {
    // if no offset is set on last keyframe, it is assumed to be 1
    last.offset = 1
  }

  // fill in the rest of the offsets
  for (let i = 1, ilen = keyframes.length; i < ilen; i++) {
    const target = keyframes[i]
    if (isDefined(target.offset)) {
      // skip entries that have an offset
      continue
    }

    // search for the next offset with a value
    for (let j = i + 1; j < ilen; j++) {
      // pass if offset is not set
      const endTime = keyframes[j].offset
      if (!isDefined(endTime)) {
        continue
      }

      // calculate timing/position info
      const startTime = keyframes[i - 1].offset
      const timeDelta = endTime - startTime
      const deltaLength = j - i + 1

      // set the values of all keyframes between i and j (exclusive)
      for (let k = 1; k < deltaLength; k++) {
        // set to percentage of change over time delta + starting time
        keyframes[k - 1 + i].offset = k / j * timeDelta + startTime
      }

      // move i past this keyframe since all frames between should be processed
      i = j
      break
    }
  }
}
