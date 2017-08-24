import {
  AnimationOptions,
  Effect,
  PropertyEffects,
  PropertyResolver,
  PropertyValue,
  TargetConfiguration,
  PropertyObject,
  JustAnimatePlugin,
  PropertyValueOptions,
  Interpolator
} from './types'
import { resolveProperty } from './resolve-property'
import { forEach, indexOf, list, head, tail, pushDistinct, push, sortBy } from './lists'
import { isDefined, isObject, isNumber, isArrayLike } from './inspect'
import { flr, max } from './math'
import { _ } from './constants'

const offsetSorter = sortBy<{ offset: number }>('offset')

export function toEffects(plugin: JustAnimatePlugin, targetConfig: TargetConfiguration): Effect[] {
  const result: Effect[] = []

  const { from, to, duration, keyframes, target, targetLength } = targetConfig

  // construct property animation options
  var effects: PropertyEffects = {}
  forEach(keyframes, p => {
    const effects2 = effects[p.prop] || (effects[p.prop] = [])
    const offset = (p.time - from) / (duration || 1)
    const easing = p.easing
    const interpolate = p.interpolate
    const value = resolveProperty(p.value, target, p.index, targetLength)

    const effect2 =
      head(effects2, e => e.offset === offset) ||
      push(effects2, {
        easing,
        offset,
        value,
        interpolate
      })

    effect2.easing = easing
    effect2.value = value
    effect2.interpolate = interpolate
  })

  // process handlers
  if (plugin.onWillAnimate) {
    plugin.onWillAnimate(targetConfig, effects)
  }

  for (var prop in effects) {
    var effect = effects[prop]
    if (effect) {
      effect.sort(offsetSorter)

      var firstFrame = head(effect, c => c.offset === 0)
      if (firstFrame === _ || firstFrame.value === _) {
        // add keyframe if offset 0 is missing
        var value2 = plugin.getValue(target, prop)
        if (firstFrame === _) {
          effect.splice(0, 0, {
            offset: 0,
            value: value2,
            easing: targetConfig.easing,
            interpolate: _
          })
        } else {
          firstFrame.value = value2
          firstFrame.easing = targetConfig.easing
          firstFrame.interpolate = _
        }
      }

      // fill empty frames with the previous value
      for (var x = effect.length - 1; x > 0; x--) {
        var currentValue = effect[x]
        if (currentValue.value === _) {
          var y = x
          var previousValue
          for (; x > -1; x--) {
            previousValue = effect[x]
            if (previousValue.value !== _) {
              break
            }
          }
          for (var z = x; z <= y; z++) {
            effect[z].value = previousValue.value
            effect[z].interpolate = previousValue.interpolate
          }
        }
      }

      // guarantee a frame at offset 1
      var lastFrame = tail(effect, c => c.offset === 1)
      if (lastFrame === _ || lastFrame.value === _) {
        // add keyframe if offset 1 is missing
        var value3 = effect[effect.length - 1].value
        if (lastFrame === _) {
          push(effect, {
            offset: 1,
            value: value3,
            easing: targetConfig.easing,
            interpolate: _
          })
        } else {
          lastFrame.value = value3
          lastFrame.easing = targetConfig.easing
          firstFrame.interpolate = _
        }
      }

      push(result, {
        plugin: plugin.name,
        target,
        prop,
        from,
        to,
        keyframes: effect
      })
    }
  }

  return result
}

export function addPropertyKeyframes(target: TargetConfiguration, index: number, options: AnimationOptions) {
  const props = options[target.plugin]
  const staggerMs = (options.stagger && options.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(options.delay, target, index, target.targetLength) || 0
  const from = max(staggerMs + delayMs + options.from, 0)
  const duration = options.to - options.from
  const easing = options.easing || 'ease'

  // iterate over each property split it into keyframes
  for (var name in props) {
    if (props.hasOwnProperty(name)) {
      addProperty(target, index, name, props[name], duration, from, easing)
    }
  }
}

function addProperty(
  target: TargetConfiguration,
  index: number,
  name: string,
  val: PropertyResolver<PropertyValue> | PropertyResolver<PropertyValue>[],
  duration: number,
  from: number,
  defaultEasing: string
) {
  // skip undefined options
  if (!isDefined(val)) {
    return
  }

  let defaultInterpolator: Interpolator = _

  // add property to list of properties
  pushDistinct(target.propNames, name)

  let values: PropertyResolver<PropertyValue>[]
  if (isArrayLike(val) || !isObject(val)) {
    values = list(val)
  } else {
    // todo: add in object notation here
    const objVal = val as PropertyValueOptions
    if (objVal.easing) {
      defaultEasing = objVal.easing
    }
    if (objVal.interpolate) {
      defaultInterpolator = objVal.interpolate
    }
    values = list(objVal.value)
  }

  // resolve options to keyframes
  const keyframes = values.map((v, i, vals) => {
    const valOrObj = resolveProperty(v, target.target, index, target.targetLength)
    const valObj = valOrObj as PropertyObject
    const isObj2 = isObject(valOrObj)

    const value = isObj2 ? valObj.value : valOrObj as string | number

    const offset =
      isObj2 && isNumber(valObj.offset)
        ? // object has an explicit offset
          valObj.offset
        : i === vals.length - 1
          ? // last in array is offset: 1
            1
          : i === 0
            ? // first in the array is offset: 0
              0
            : _

    const interpolate = (valObj && valObj.interpolate) || defaultInterpolator
    const easing = (valObj && valObj.easing) || defaultEasing

    return { offset, value, easing, interpolate }
  })

  // insert offsets where not present
  inferOffsets(keyframes)

  keyframes.forEach(keyframe => {
    const { offset, value, easing, interpolate } = keyframe
    const time = flr(duration * offset + from)
    const indexOfFrame = indexOf(target.keyframes, k => k.prop === name && k.time === time)

    if (indexOfFrame !== -1) {
      target.keyframes[indexOfFrame].value = value
      return
    }

    push(target.keyframes, {
      easing,
      index,
      prop: name,
      time,
      value,
      interpolate
    })
  })

  // insert start frame if not present
  if (!head(target.keyframes, k => k.prop === name && k.time === from)) {
    push(target.keyframes, {
      easing: defaultEasing,
      index,
      prop: name,
      time: from,
      value: _,
      interpolate: _
    })
  }

  // insert end frame if not present
  var to = from + duration
  if (!tail(target.keyframes, k => k.prop === name && k.time === to)) {
    push(target.keyframes, {
      easing: _,
      index,
      prop: name,
      time: to,
      value: _,
      interpolate: _
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
