import {
  AnimationOptions,
  Effect,
  PropertyEffects,
  PropertyResolver,
  PropertyValue,
  TargetConfiguration,
  PropertyObject,
  PropertyValueOptions,
  Interpolator,
  Dictionary,
  PropertyEffect,
  JustAnimatePlugin
} from './types'
import { resolveProperty } from './resolve-property'
import { all, indexOf, list, find, push, sortBy, pushDistinct } from './lists'
import { isDefined, isObject, isNumber, isArrayLike } from './inspect'
import { flr, max } from './math'
import { _ } from './constants'
import { plugins } from './plugins'
import { getTargets } from './get-targets'
import { assign, owns } from './utils'

const offsetSorter = sortBy<{ offset: number }>('offset')

export function toEffects(targetConfig: TargetConfiguration): Effect[] {
  const keyframes = targetConfig.keyframes
  const from = targetConfig.from
  const to = targetConfig.to
  const stagger = targetConfig.stagger || 0
  const duration = targetConfig.duration
  const result: Effect[] = []

  all(getTargets(targetConfig.target), (target, index, targetLength) => {
    // construct property animation options
    var effects: PropertyEffects = {}
    var propToPlugin: Dictionary<string> = {}

    all(keyframes, p => {
      const effects3 = effects[p.prop] || (effects[p.prop] = [])
      const offset = (p.time - from) / (duration || 1)
      const easing = p.easing
      const interpolate = p.interpolate
      const value = resolveProperty(p.value, target, p.index, targetLength)
      propToPlugin[p.prop] = p.plugin

      const effect2 =
        find(effects3, e => e.offset === offset) ||
        push(effects3, {
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
    for (var pluginName in plugins) {
      var plugin2 = plugins[pluginName]
      if (plugin2.onWillAnimate && targetConfig.keyframes.some(c => c.plugin === pluginName)) {
        var targetConfig2 = assign(targetConfig, { target }) as typeof targetConfig
        plugin2.onWillAnimate(targetConfig2, effects, propToPlugin)
      }
    }

    for (var prop in effects) {
      var effects2 = effects[prop]
      var pluginName2 = propToPlugin[prop]
      var plugin = plugins[pluginName2]
      if (effects2) {
        effects2.sort(offsetSorter)

        ensureFirstFrame(targetConfig, effects2, target, plugin, prop)
        fillValues(effects2)
        fillInterpolators(effects2)
        ensureLastFrame(targetConfig, effects2)

        push(result, {
          plugin: propToPlugin[prop],
          target,
          prop,
          from: from + (stagger ? (stagger + 1) * index : 0),
          to: to + (stagger ? (stagger + 1) * index : 0),
          keyframes: effects2
        })
      }
    }
  })

  return result
}
function fillValues(items: PropertyEffect[]) {
  var lastValue: any
  all(items, item => {
    if (item.value !== _) {
      lastValue = item.value
    } else {
      item.value = lastValue
    }
  })
}

function fillInterpolators(items: PropertyEffect[]) {
  var lastInterpolator: Interpolator
  for (var y = items.length - 1; y > -1; y--) {
    var item2 = items[y]
    if (item2.interpolate !== _) {
      lastInterpolator = item2.interpolate
    } else {
      item2.interpolate = lastInterpolator
    }
  }
}

function ensureFirstFrame(
  config: TargetConfiguration,
  items: PropertyEffect[],
  target: any,
  plugin: JustAnimatePlugin,
  prop: string
) {
  var firstFrame = find(items, c => c.offset === 0)
  if (firstFrame === _ || firstFrame.value === _) {
    // add keyframe if offset 0 is missing
    var value2 = plugin.getValue(target, prop)
    if (firstFrame === _) {
      items.splice(0, 0, {
        offset: 0,
        value: value2,
        easing: config.easing,
        interpolate: _
      })
    } else {
      firstFrame.value = value2
      firstFrame.easing = config.easing
      firstFrame.interpolate = _
    }
  }
}

function ensureLastFrame(config: TargetConfiguration, items: PropertyEffect[]) {
  // guarantee a frame at offset 1
  var lastFrame = find(items, c => c.offset === 1, true)
  if (lastFrame === _ || lastFrame.value === _) {
    // add keyframe if offset 1 is missing
    var value3 = items[items.length - 1].value
    if (lastFrame === _) {
      push(items, {
        offset: 1,
        value: value3,
        easing: config.easing,
        interpolate: _
      })
    } else {
      lastFrame.value = value3
      lastFrame.easing = lastFrame.easing || config.easing
    }
  }
}

export function addPropertyKeyframes(target: TargetConfiguration, index: number, options: AnimationOptions) {
  const staggerMs = (options.stagger && options.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(options.delay, target, index, target.targetLength) || 0
  const from = max(staggerMs + delayMs + options.from, 0)
  const duration = options.to - options.from
  const easing = options.easing || 'ease'

  // iterate over each property split it into keyframes
  for (var pluginName in plugins) {
    if (owns(options, pluginName)) {
      const props = options[pluginName]
      for (var name in props) {
        if (owns(props, name)) {
          pushDistinct(target.propNames, name)
          addProperty(target, pluginName, index, name, props[name], duration, from, easing)
        }
      }
    }
  }
}

function addProperty(
  target: TargetConfiguration,
  plugin: string,
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

  let defaultInterpolator: Interpolator | string = _

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

    // assign last and first offsets
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

  // add all unique frames
  all(keyframes, keyframe => {
    const { offset, value, easing, interpolate } = keyframe
    const time = flr(duration * offset + from)
    const indexOfFrame = indexOf(target.keyframes, k => k.prop === name && k.time === time)

    if (indexOfFrame !== -1) {
      target.keyframes[indexOfFrame].value = value
      return
    }

    push(target.keyframes, {
      plugin,
      easing,
      index,
      prop: name,
      time,
      value,
      interpolate
    })
  })

  // insert start frame if not present
  find(target.keyframes, k => k.prop === name && k.time === from) ||
    push(target.keyframes, {
      plugin,
      easing: defaultEasing,
      index,
      prop: name,
      time: from,
      value: _,
      interpolate: defaultInterpolator
    })

  // insert end frame if not present
  var to = from + duration
  find(target.keyframes, k => k.prop === name && k.time === to, true) ||
    push(target.keyframes, {
      plugin,
      easing: defaultEasing,
      index,
      prop: name,
      time: to,
      value: _,
      interpolate: defaultInterpolator
    })
}

function inferOffsets(keyframes: PropertyObject[]) {
  if (!keyframes.length) {
    return
  }

  // search for offset 0 or assume it is the first one in the list
  const first = find(keyframes, k => k.offset === 0) || keyframes[0]
  if (!isDefined(first.offset)) {
    // if no offset is set on first keyframe, it is assumed to be 0
    first.offset = 0
  }

  // search for offset 1 or assume it is the last one in the list
  const last = find(keyframes, k => k.offset === 1, true) || keyframes[keyframes.length - 1]
  if (keyframes.length > 1 && !isDefined(last.offset)) {
    // if no offset is set on last keyframe, it is assumed to be 1
    last.offset = 1
  }

  // fill in the rest of the offsets
  for (let i = 1, ilen = keyframes.length; i < ilen; i++) {
    const target = keyframes[i]

    // skip entries that have an offset
    if (!isDefined(target.offset)) {
      // search for the next offset with a value
      for (let j = i + 1; j < ilen; j++) {
        // pass if offset is not set
        const endTime = keyframes[j].offset
        if (isDefined(endTime)) {

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
  }
}
