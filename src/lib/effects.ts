import { AnimationOptions, Effect, KeyframeOptions, PropertyEffects, PropertyOptions, TargetConfiguration } from './types'
import { resolveProperty } from './resolve-property'
import { getPlugins } from './plugins'
import { forEach, indexOf, list, head, tail, pushDistinct, push } from './lists'
import { isDefined, isArrayLike } from './inspect'
import { flr, max } from './math'
import { _ } from './constants';

export function toEffects(configs: TargetConfiguration[]): Effect[] {
  const result: Effect[] = []
  const plugins = getPlugins()

  forEach(configs, targetConfig => {
    const { from, to, duration, keyframes, target } = targetConfig

    // construct property animation options
    var effects: PropertyEffects = {}
    forEach(keyframes, p => {
      const effect = (effects[p.prop] || (effects[p.prop] = {}))
      const offset = (p.time - from) / (duration || 1)
      const value = resolveProperty(p.value, target, p.index)

      effect[offset] = value
    })

    // process handlers
    forEach(plugins, plugin => {
      if (plugin.onWillAnimate) {
        plugin.onWillAnimate(targetConfig, effects)
      }
    })

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
          for (var i = 0, ilen = plugins.length; i < ilen; i++) {
            var plugin = plugins[i]
            if (plugin.isHandled(target, prop)) {
              var value = plugin.getValue(target, prop)
              if (firstFrame === _) {
                effectKeyframes.splice(0, 0, {
                  offset: 0,
                  value: value
                })
              } else {
                firstFrame.value = value
              } 
              break
            }
          }
        }

        push(result, {
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
  target: TargetConfiguration,
  index: number,
  options: AnimationOptions
) {
  const props = options.props
  const staggerMs = (options.stagger && options.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(options.delay, target, index) || 0
  const from = max(staggerMs + delayMs + options.from, 0)
  const duration = options.to - options.from

  if (isArrayLike(props)) {
    // fill in missing offsets
    inferOffsets(options.props as KeyframeOptions[])
    addKeyframes(target, index, props as KeyframeOptions[], duration, from)
  } else {
    addProperties(target, index, props as PropertyOptions, duration, from)
  }
}

function addKeyframes(
  target: TargetConfiguration,
  index: number,
  props: KeyframeOptions[],
  duration: number,
  from: number
) {
  forEach(props, keyframe => {
    const time = flr(duration * keyframe.offset + from)
    const keyframes = target.keyframes

    for (var name in keyframe) {
      if (name === 'offset') {
        continue
      }

      var value = keyframe[name] as string | number
      if (!isDefined(value)) {
        continue
      }

      // add property name if not present 
      pushDistinct(target.propNames, name)

      // find matching keyframe
      var existingFrame = head(keyframes, k => k.prop === name && k.time === time)
      if (existingFrame) {
        existingFrame.value = value
        continue
      }

      push(keyframes, {
        index,
        prop: name,
        time,
        value
      })
    }
  })
}

function addProperties(
  target: TargetConfiguration,
  index: number,
  props: PropertyOptions,
  duration: number,
  from: number
): void {
  // iterate over each property split it into keyframes
  for (var name in props) {
    if (!props.hasOwnProperty(name)) {
      continue
    }

    var val = props[name]
    // skip undefined options
    if (!isDefined(val)) {
      continue
    }

    var keyframes = target.keyframes
    var valAsArray = list(val)
    for (var i = 0, ilen = valAsArray.length; i < ilen; i++) {
      var offset: number
      if (i === ilen - 1) {
        offset = 1
      } else if (i === 0) {
        offset = 0
      } else {
        offset = i / (ilen - 1.0)
      }

      var time = flr(duration * offset + from)

      // add property name if not present
      pushDistinct(target.propNames, name)

      // find matching keyframe
      var indexOfFrame = indexOf(keyframes, k => k.prop === name && k.time === time)

      var value = valAsArray[i]
      if (indexOfFrame !== -1) {
        keyframes[indexOfFrame].value = value
        continue
      }

      push(keyframes, {
        index,
        prop: name,
        time,
        value
      })
    }

    // insert start frame if not present
    if (!head(keyframes, k => k.prop === name && k.time === from)) {
      push(keyframes, {
        index,
        prop: name,
        time: from,
        value: _
      })
    }

    // insert start frame if not present
    var to = from + duration
    if (!tail(keyframes, k => k.prop === name && k.time === to)) {
      push(keyframes, {
        index,
        prop: name,
        time: to,
        value: _
      })
    }
  }
}

function inferOffsets(keyframes: KeyframeOptions[]) {
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
