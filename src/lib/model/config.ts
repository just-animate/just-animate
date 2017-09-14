import { sortBy, all, includes, find, push, pushDistinct, indexOf, list } from '../utils/lists'
import {
  PropertyKeyframe,
  AddAnimationOptions,
  AnimationOptions,
  BaseAnimationOptions,
  BaseSetOptions,
  ITimelineModel,
  TargetConfiguration,
  PropertyResolver,
  PropertyValue,
  Interpolator,
  PropertyValueOptions,
  PropertyObject
} from '../types'
import { getModel } from './store'
import { isDefined, isObject, isArrayLike, isNumber } from '../utils/inspect'
import { CONFIG, _ } from '../utils/constants'
import { publish } from '../dispatcher'
import { plugins } from '../plugins'
import { replaceWithRefs } from '../references'
import { resolveProperty } from '../resolve-property'
import { max, flr } from '../utils/math'
import { owns } from '../utils/utils'

const propKeyframeSort = sortBy<PropertyKeyframe>('time') 

export function appendConfig(id: string, opts: AddAnimationOptions | AddAnimationOptions[]) { 
    const model = getModel(id)
    const _nextTime = model.pos
    
    all(opts, opt => {
      const { to, from, duration } = opt
      const hasTo = isDefined(to)
      const hasFrom = isDefined(from)
      const hasDuration = isDefined(duration)
  
      // pretty exaustive rules for importing times
      const to2 = hasTo && (hasFrom || hasDuration)
        ? to
        : hasDuration && hasFrom
          ? from + duration 
            : hasTo && !hasDuration
              ? _nextTime + to
              : hasDuration
                ? _nextTime + duration
                : _ 
      
      const from2 = hasFrom && (hasTo || hasDuration)
          ? from
          : hasTo && hasDuration
            ? to - duration
            : hasTo || hasDuration
              ? _nextTime
              : _;
  
      insert(model, from2, to2, opt as AnimationOptions)
    })
  
    // recalculate property keyframe times and total duration
    calculateTimes(model)
    publish(model.id, CONFIG, model.time)
  }
  
export function insertConfigs(id: string, from: number, to: number, options: BaseAnimationOptions | BaseAnimationOptions[]) { 
    const model = getModel(id)
    all(options, options2 => {
      insert(model, from, to, options2 as AnimationOptions)
    }) 
    // recalculate property keyframe times and total duration
    calculateTimes(model)
    publish(model.id, CONFIG, model.time)
  }
  
export function insertSetConfigs(id: string, options: BaseSetOptions | BaseSetOptions[]) {
    const model = getModel(id)
    const pluginNames = Object.keys(plugins)
  
    all(options, opts => {
      const at = opts.at || model.pos
      const opts2 = {} as AnimationOptions
  
      for (var name in opts) {
        if (includes(pluginNames, name)) {
          // if property is going to be handled by a plugin, replace each of its properties with an array with an empty spot
          // this empty will be resolved when the timeline creates effects
          const props = opts[name]
          const props2 = {} as typeof props
          for (var propName in props) {
            var value = props[propName]
            props2[propName] = [_, value]
          }
          opts2[name] = props2
        } else {
          opts2[name] = opts[name]
        }
      }
      // insert from (time - super small decimal) + the time specified, this should create a tween that is effectively
      // so small as to not occur in most cases.  This should "look like" setting it
      insert(model, at - 0.000000001, at, opts2)
    })
  
    calculateTimes(model)
    publish(model.id, CONFIG, model.time)
  }

function insert(model: ITimelineModel, from: number, to: number, opts: AnimationOptions) {
    if (to === _) {
      throw new Error('missing duration')
    }
    
    const config = model.configs
    opts = replaceWithRefs(model.refs, opts, true) as AnimationOptions
  
    // ensure to/from are in milliseconds (as numbers)
    opts.from = from
    opts.to = to
    opts.duration = opts.to - opts.from
  
    // add all targets as property keyframes
    all(opts.targets, (target, i, ilen) => {
      const delay = resolveProperty(opts.delay, target, i, ilen) || 0
      const targetConfig =
        find(config, c => c.target === target) ||
        push(config, {
          from: max(opts.from + delay, 0),
          to: max(opts.to + delay, 0),
          easing: opts.easing || 'ease',
          duration: opts.to - opts.from,
          endDelay: resolveProperty(opts.endDelay, target, i, ilen) || 0,
          stagger: opts.stagger || 0,
          target,
          targetLength: ilen,
          propNames: [],
          keyframes: []
        })
  
      addPropertyKeyframes(targetConfig, i, opts)
  
      // sort property keyframes
      all(config, c => c.keyframes.sort(propKeyframeSort))
    })
     
  }

function addPropertyKeyframes(config: TargetConfiguration, index: number, options: AnimationOptions) {
  const staggerMs = (options.stagger && options.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(options.delay, config, index, config.targetLength) || 0
  const from = max(staggerMs + delayMs + options.from, 0)
  const duration = options.to - options.from
  const easing = options.easing || 'ease'

  // iterate over each property split it into keyframes
  for (var pluginName in plugins) {
    if (owns(options, pluginName)) {
      const props = options[pluginName]
      for (var name in props) {
        if (owns(props, name)) {
          pushDistinct(config.propNames, name)
          addProperty(config, pluginName, index, name, props[name], duration, from, easing)
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

function calculateTimes(model: ITimelineModel) {
  let timelineTo = 0
  let maxNextTime = 0

  all(model.configs, config => {
    const { keyframes } = config

    var targetFrom: number
    var targetTo: number

    all(keyframes, keyframe => {
      const time = keyframe.time
      if (time < targetFrom || targetFrom === _) {
        targetFrom = time
      }
      if (time > targetTo || targetTo === _) {
        targetTo = time
        if (time > timelineTo) {
          timelineTo = time
        }
      }
    })

    config.to = targetTo
    config.from = targetFrom
    config.duration = targetTo - targetFrom

    maxNextTime = max(targetTo + config.endDelay, maxNextTime)
  })

  model.pos = maxNextTime
  model.duration = timelineTo
}
