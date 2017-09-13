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
  JustAnimatePlugin,
  ITimelineModel,
  TimelineOptions,
  AnimationTimelineController,
  PropertyKeyframe,
  AddAnimationOptions,
  ITimeline,
  BaseAnimationOptions,
  BaseSetOptions,
  PlayOptions
} from './types'

import { resolveProperty } from './resolve-property'
import { all, indexOf, list, find, push, sortBy, pushDistinct, mapFlatten, includes } from './utils/lists'
import { isDefined, isObject, isNumber, isArrayLike } from './utils/inspect'
import { flr, max, inRange, minMax } from './utils/math'
import {
  _,
  FINISH,
  UPDATE,
  S_PENDING,
  S_RUNNING,
  S_PAUSED,
  CANCEL,
  PAUSE,
  S_FINISHED,
  S_IDLE,
  CONFIG,
  PLAY,
  REVERSE
} from './utils/constants'
import { plugins } from './plugins'
import { getTargets } from './get-targets'
import { assign, owns } from './utils/utils'
import { resolveRefs, replaceWithRefs } from './references'
import { loopOn, loopOff } from './timeloop'

const offsetSorter = sortBy<{ offset: number }>('offset')
const propKeyframeSort = sortBy<PropertyKeyframe>('time') 

export function playTimeline(model: ITimelineModel, options: PlayOptions) {
  if (options) {
    model._repeat = options.repeat
    model._yoyo = options.alternate === true
  }

  model._repeat = model._repeat || 1
  model._yoyo = model._yoyo || false
  model._state = S_RUNNING
  updateTimeline(model, PLAY)
}

export function getEffects(model: ITimelineModel): Effect[] { 
  return mapFlatten(model._configs, c => 
    toEffects(
      resolveRefs(model._refs, c, true)
    )
  )
}

function toEffects(config: TargetConfiguration): Effect[] {
  const keyframes = config.keyframes
  const from = config.from
  const to = config.to
  const stagger = config.stagger || 0
  const duration = config.duration
  const result: Effect[] = []

  all(getTargets(config.target), (target, index, targetLength) => {
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
      if (plugin2.onWillAnimate && config.keyframes.some(c => c.plugin === pluginName)) {
        var targetConfig2 = assign(config, { target }) as typeof config
        plugin2.onWillAnimate(targetConfig2, effects, propToPlugin)
      }
    }

    for (var prop in effects) {
      var effects2 = effects[prop]
      var pluginName2 = propToPlugin[prop]
      var plugin = plugins[pluginName2]
      if (effects2) {
        effects2.sort(offsetSorter)

        ensureFirstFrame(config, effects2, target, plugin, prop)
        fillValues(effects2)
        fillInterpolators(effects2)
        ensureLastFrame(config, effects2)

        push(result, {
          // config,
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

export function fromModel(model: ITimeline) {
  return model._model
}

export function appendConfig(model: ITimelineModel, opts: AddAnimationOptions | AddAnimationOptions[]) { 
  const _nextTime = model._pos
  
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
  all(model._subs[CONFIG], c => c(model._time)) 
}

export function insertConfigs(model: ITimelineModel, from: number, to: number, options: BaseAnimationOptions | BaseAnimationOptions[]) { 
  all(options, options2 => {
    insert(model, from, to, options2 as AnimationOptions)
  }) 
  // recalculate property keyframe times and total duration
  calculateTimes(model)
}

export function insertSetConfigs(model: ITimelineModel, options: BaseSetOptions | BaseSetOptions[]) {
  const pluginNames = Object.keys(plugins)

  all(options, opts => {
    const at = opts.at || model._pos
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
}

export function insert(model: ITimelineModel, from: number, to: number, opts: AnimationOptions) {
  if (to === _) {
    throw new Error('missing duration')
  }
  
  const config = model._configs
  opts = replaceWithRefs(model._refs, opts, true) as AnimationOptions

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

export function calculateTimes(model: ITimelineModel) {
  let timelineTo = 0
  let maxNextTime = 0

  all(model._configs, config => {
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

  model._pos = maxNextTime
  model._duration = timelineTo
}
function setupEffects(model: ITimelineModel) {
  if (model._ctrls) {
    return
  }
 
  const animations: AnimationTimelineController[] = []

  all(getEffects(model), effect => {
    const controller = plugins[effect.plugin].animate(effect) as AnimationTimelineController
    if (controller) {
      // controller.config = effect.config
      controller.from = effect.from
      controller.to = effect.to
      push(animations, controller)
    }
  }) 
  
  model._ctrls = animations    
  updateTime(model, _) 
}

export function updateTime(model: ITimelineModel, time: number) {
  time = +time
  model._time = isFinite(time) ? time : model._rate < 0 ? model._duration : 0
  updateTimeline(model, UPDATE)
}

export function updateRate(model: ITimelineModel, rate: number) {
  model._rate = +rate || 1
  updateTimeline(model, REVERSE)
}

export function updateTimeline(model: ITimelineModel, type: string) {
  
  // update state and loop
  if (type === CANCEL) {
    model._round = 0
    model._state = S_IDLE
  } else if (type === FINISH) {
    model._round = 0
    model._state = S_FINISHED
    if (!model._yoyo) {
      model._time = model._rate < 0 ? 0 : model._duration
    }
  } else if (type === PAUSE) {
    model._state = S_PAUSED
  } else if (type === PLAY) {
    // set current time (this will automatically start playing when the _state is running)
    const isForwards = model._rate >= 0
    if (isForwards && model._time === model._duration) {
      model._time = 0
    } else if (!isForwards && model._time === 0) {
      model._time = model._duration
    }
  }

  // check current state
  const isTimelineActive = model._state === S_RUNNING
  const isTimelineInEffect = model._state !== S_IDLE

  // setup effects if required
  if (isTimelineInEffect && model._ctrls === _) {
    setupEffects(model)
  }
  
  const time = model._time
  const rate = model._rate

  // update effect clocks
  if (isTimelineInEffect) {
    // update effects
    all(model._ctrls, effect => {
      const { from, to } = effect
      const isAnimationActive = isTimelineActive && inRange(flr(time), from, to)
      const offset = minMax((time - from) / (to - from), 0, 1)

      effect.update(offset, rate, isAnimationActive)
    })
  }

  // remove tick from loop if no timelines are active
  if (!isTimelineActive) {
    loopOff(model._tick)
  }
  if (type === PLAY) {
    loopOn(model._tick)
  }

  // teardown/destroy
  if (!isTimelineInEffect) {
    all(model._ctrls, effect => effect.cancel())
    model._time = 0
    model._round = _
    model._ctrls = _
  }

  // call extra update event on finish
  if (type === FINISH) {
    all(model._subs[UPDATE], c => c(time))
  }

  // notify event listeners
  all(model._subs[type], c => c(time)) 
}

function tick(model: ITimelineModel, delta: number) {
  const playState = model._state

  // canceled
  if (playState === S_IDLE) {
    updateTimeline(model, CANCEL)
    return
  }
  // finished
  if (playState === S_FINISHED) {
    updateTimeline(model, FINISH)
    return
  }
  // paused
  if (playState === S_PAUSED) {
    updateTimeline(model, PAUSE)
    return
  }

  // calculate running range
  const duration = model._duration
  const repeat = model._repeat
  const rate = model._rate
  const isReversed = rate < 0

  // set time use existing
  let time = model._time === _ ? (rate < 0 ? duration : 0) : model._time

  let iteration = model._round || 0

  if (model._state === S_PENDING) {
    model._state = S_RUNNING

    // reset position properties if necessary
    if (time === _ || (isReversed && time > duration) || (!isReversed && time < 0)) {
      // if at finish, reset to start time
      time = isReversed ? duration : 0
    }
    if (iteration === repeat) {
      // if at finish reset iterations to 0
      iteration = 0
    }
  }

  time += delta * rate

  // check if timeline has finished
  let iterationEnded = false
  if (!inRange(time, 0, duration)) {
    model._round = ++iteration
    time = isReversed ? 0 : duration
    iterationEnded = true

    // reverse direction on alternate
    if (model._yoyo) {
      model._rate = (model._rate || 0) * -1
    }

    // reset the clock
    time = model._rate < 0 ? duration : 0
  }

  // call update
  model._round = iteration
  model._time = time

  if (!iterationEnded) {
    // if not ended, return early
    all(model._subs[UPDATE], c => c(time))
    updateTimeline(model, UPDATE)
    return
  }

  if (repeat === iteration) {
    // end the cycle
    updateTimeline(model, FINISH)
    return
  }

  // if not the last iteration reprocess this tick from the new starting point/direction
  all(model._subs[UPDATE], c => c(time))
  updateTimeline(model, UPDATE)
}

export function createInitial(opts: TimelineOptions): ITimelineModel {
  const refs = {}
  if (opts.references) {
    for (var name in opts.references) {
      refs['@' + name] = opts.references[name]
    }
  }
  
  // initialize default values 
  const model: ITimelineModel = {
    _duration: 0,
    _pos: 0,
    _rate: 1,
    _yoyo: false,
    _state: S_IDLE,
    _configs: [],
    _ctrls: _,
    _repeat: _,
    _round: _,
    _refs: refs,
    _time: _,
    _subs: {}
  } 
  model._tick = delta => tick(model, delta)
  
  return model 
}
