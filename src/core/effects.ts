import * as types from '../types'
import { resolveProperty } from '.'
import { getPlugins } from './plugins'
import { forEach, indexOf, push, list, head, tail } from '../utils/lists'
import { isDefined, isArrayLike } from '../utils/type'
import { flr, max } from '../utils/math'

export function toEffects(configs: types.TargetConfiguration[]): types.Effect[] {
  const result: types.Effect[] = []
  const plugins = getPlugins()

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
    forEach(plugins, plugin => {
      if (plugin.transform) {
        plugin.transform(targetConfig, effects)
      }
    })

    for (var prop in effects) {
      var effect = effects[prop]
      if (effect) {
        // remap the keyframes field to remove multiple values
        // add to list of Effects
        result.push({
          target,
          prop,
          from,
          to,
          keyframes: effect
        })
      }
    }
  })

  return result
}

export function addPropertyKeyframes(
  target: types.TargetConfiguration,
  index: number,
  options: types.AnimationOptions
) {
  const props = options.props
  const staggerMs = (options.stagger && options.stagger * (index + 1)) || 0
  const delayMs = resolveProperty(options.delay, target, index) || 0
  const from = max(staggerMs + delayMs + options.from, 0)
  const duration = options.to - options.from

  if (isArrayLike(props)) {
    // fill in missing offsets
    inferOffsets(options.props as types.KeyframeOptions[])
    addKeyframes(target, index, props as types.KeyframeOptions[], duration, from)
  } else {
    addProperties(target, index, props as types.PropertyOptions, duration, from)
  }
}

function addKeyframes(
  target: types.TargetConfiguration,
  index: number,
  props: types.KeyframeOptions[],
  duration: number,
  from: number
) {
  forEach(props, keyframe => {
    const time = flr(duration * keyframe.offset + from)
    const keyframes = target.keyframes
    let count = -1

    for (var name in keyframe) {
      if (name === 'offset') {
        continue
      }

      var value = keyframe[name] as string | number
      if (!isDefined(value)) {
        continue
      }

      // add property name if not present
      var propIndex = target.propNames.indexOf(name)
      if (propIndex === -1) {
        target.propNames.push(name)
      }

      // find matching keyframe
      var indexOfFrame = indexOf(keyframes, k => k.prop === name && k.time === time)
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
  })
}

function addProperties(
  target: types.TargetConfiguration,
  index: number,
  props: types.PropertyOptions,
  duration: number,
  from: number
): void {
  // iterate over each property split it into keyframes
  for (let name in props) {
    if (!props.hasOwnProperty(name)) {
      continue
    }

    // resolve value (changes function into discrete value or array)
    const val = props[name]
    // skip undefined options
    if (!isDefined(val)) {
      continue
    }

    const keyframes = target.keyframes
    let count = -1

    const valAsArray = list(val)
    for (let i = 0, ilen = valAsArray.length; i < ilen; i++) {
      const offset = i === 0 ? 0 : i === ilen - 1 ? 1 : i / (ilen - 1.0)
      const time = flr(duration * offset + from)

      // add property name if not present
      var propIndex = target.propNames.indexOf(name)
      if (propIndex === -1) {
        target.propNames.push(name)
      }

      // find matching keyframe
      var indexOfFrame = indexOf(keyframes, k => k.prop === name && k.time === time)

      const value = val[i]
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
}

function inferOffsets(keyframes: types.KeyframeOptions[]) {
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
