import { replaceWithRefs } from '../core/references'
import {
  ITimelineModel,
  AnimationOptions,
  PropertyObject,
  PropertyValueOptions,
  Interpolator,
  PropertyResolver,
  TargetConfiguration,
  PropertyValue,
  PropertyKeyframe
} from '../core/types'
import { _, CONFIG } from '../utils/constants'
import { all, find, push, list, pushDistinct, sortBy } from '../utils/lists'
import { flr, max } from '../utils/math'
import { resolveProperty } from '../utils/resolve-property'
import { isObject, isNumber, isArrayLike, isOwner, isDefined } from '../utils/inspect'
import { plugins } from '../core/plugins' 
import { IReducer, IReducerContext } from '../core/types'
import { calculateConfigs } from './calc-configs'

const propKeyframeSort = sortBy<PropertyKeyframe>('time')

export const insert: IReducer = (model: ITimelineModel, options: AnimationOptions[], ctx: IReducerContext) => {
  all(options, opts => {
    if (opts.to === _) {
      throw new Error('missing duration')
    }

    opts = replaceWithRefs(model.refs, opts, true) as AnimationOptions

    // add all targets as property keyframes
    all(opts.targets, (target, i, ilen) => {
      const config = addPropertyKeyframes(model, target, i, ilen, opts)
      ctx.dirty(config)
    })
  })

  // recalculate property keyframe times and total duration
  calculateConfigs(model)
  ctx.trigger(CONFIG) 
}

function addPropertyKeyframes(model: ITimelineModel, target: any, index: number, ilen: number, opts: AnimationOptions) {
  const defaultEasing = 'ease'
  const delay = resolveProperty(opts.delay, target, index, ilen) || 0
  const config =
    find(model.configs, c => c.target === target) ||
    push(model.configs, {
      from: max(opts.from + delay, 0),
      to: max(opts.to + delay, 0),
      easing: opts.easing || defaultEasing,
      duration: opts.to - opts.from,
      endDelay: resolveProperty(opts.endDelay, target, index, ilen) || 0,
      stagger: opts.stagger || 0,
      target,
      targetLength: ilen,
      propNames: [],
      keyframes: []
    })

  const staggerMs = (opts.stagger && opts.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(opts.delay, config, index, config.targetLength) || 0
  const from = max(staggerMs + delayMs + opts.from, 0)
  const duration = opts.to - opts.from
  const easing = opts.easing || defaultEasing

  // iterate over each property split it into keyframes
  for (var pluginName in plugins) {
    if (isOwner(opts, pluginName)) {
      const props = opts[pluginName]
      for (var name in props) {
        var propVal = props[name]
        if (isOwner(props, name) && isDefined(propVal)) {
          addProperty(config, pluginName, index, name, propVal, duration, from, easing)
        }
      }
    }
  }

  // sort property keyframes
  config.keyframes.sort(propKeyframeSort)
  return config
}

function addProperty(
  config: TargetConfiguration,
  plugin: string,
  index: number,
  name: string,
  val: PropertyResolver<PropertyValue> | PropertyResolver<PropertyValue>[],
  duration: number,
  from: number,
  defaultEasing: string
) {
  let defaultInterpolator: Interpolator | string
  let values: PropertyResolver<PropertyValue>[]

  const isValueObject = !isArrayLike(val) && isObject(val)
  if (isValueObject) {
    const objVal = val as PropertyValueOptions
    if (objVal.easing) {
      defaultEasing = objVal.easing
    }
    if (objVal.interpolate) {
      defaultInterpolator = objVal.interpolate
    }
    values = list(objVal.value)
  } else {
    values = list(val)
  }

  // resolve options to keyframes
  const keyframes = values.map((v, i, vals) => {
    const valOrObj = resolveProperty(v, config.target, index, config.targetLength)
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
    const { offset, value } = keyframe
    const time = flr(duration * offset + from)
    const frame =
      find(config.keyframes, k => k.prop === name && k.time === time) ||
      push(config.keyframes, {
        plugin,
        easing: keyframe.easing,
        index,
        prop: name,
        time,
        value,
        interpolate: keyframe.interpolate
      })

    frame.value = value
  })

  // insert start frame if not present
  find(config.keyframes, k => k.prop === name && k.time === from) ||
    push(config.keyframes, {
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
  find(config.keyframes, k => k.prop === name && k.time === to, true) ||
    push(config.keyframes, {
      plugin,
      easing: defaultEasing,
      index,
      prop: name,
      time: to,
      value: _,
      interpolate: defaultInterpolator
    })

  pushDistinct(config.propNames, name)
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
