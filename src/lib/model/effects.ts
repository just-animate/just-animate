import { 
  Effect,
  PropertyEffects, 
  TargetConfiguration, 
  Interpolator,
  Dictionary,
  PropertyEffect,
  JustAnimatePlugin,
  ITimelineModel
} from '../types'

import { resolveProperty } from '../resolve-property'
import { all, find, push, sortBy, mapFlatten } from '../utils/lists' 
import {
  _ 
} from '../utils/constants'

import { plugins } from '../plugins'
import { getTargets } from '../get-targets'
import { assign } from '../utils/utils'
import { resolveRefs } from '../references'

const offsetSorter = sortBy<{ offset: number }>('offset')

export function getEffects(model: ITimelineModel): Effect[] { 
  return mapFlatten(model.configs, c => 
    toEffects(
      resolveRefs(model.refs, c, true)
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
          from: from + (stagger ? stagger * index : 0),
          to: to + (stagger ? stagger * index : 0),
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
