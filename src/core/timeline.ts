import * as types from '../types'

import { toEffects, addKeyframes } from './effects'
import {
  convertToMs,
  getTargets,
  inRange,
  isDefined,
  isArrayLike,
  sortBy,
  head,
  SEEK,
  UPDATE
} from '../utils'
import { _, CANCEL, FINISH, PAUSE, PLAY } from '../utils/resources'
import { timeloop, getPlugins } from '.'
import { inferOffsets } from '../transformers/infer-offsets'
import { propsToKeyframes } from '../transformers/props-to-keyframes'

const propKeyframeSort = sortBy<types.PropertyKeyframe>('time')

export class Timeline {
  public duration: number
  public playbackRate: number
  public playState: number

  private targets: types.TargetConfiguration[]
  private _animators: types.AnimationController[]
  private _iteration: number
  private _time: number
  private _dir: number
  private _listeners: { [key: string]: { (time: number): void }[] }
  private _iterations: number
  private _isReady: boolean

  public get currentTime() {
    return this._time
  }
  public set currentTime(time: number) {
    this.seek(time)
  }

  constructor() {
    const self = this
    self.duration = 0
    self._time = _
    self.playbackRate = 1
    self.playState = types.playbackState.idle
    self._animators = []
    self.targets = []
    self._isReady = false
    self._iteration = _
    self._dir = types.direction.normal
    self._iterations = _
    self._listeners = {}
  }

  public add(opts: types.AddAnimationOptions) {
    const self = this
    const hasTo = isDefined(opts.to)
    const hasFrom = isDefined(opts.from)
    const hasDuration = isDefined(opts.duration)

    // pretty exaustive rules for importing times
    let from: number, to: number
    if (hasFrom && hasTo) {
      from = convertToMs(opts.from)
      to = convertToMs(opts.to)
    } else if (hasFrom && hasDuration) {
      from = convertToMs(opts.from)
      to = from + convertToMs(opts.duration)
    } else if (hasTo && hasDuration) {
      to = convertToMs(opts.to)
      from = to - convertToMs(opts.duration)
    } else if (hasTo && !hasDuration) {
      from = self.duration
      to = from + convertToMs(opts.to)
    } else if (hasDuration) {
      from = self.duration
      to = from + convertToMs(opts.duration)
    } else {
      throw new Error('Please provide to/from/duration')
    }

    // ensure from/to is not negative
    from = Math.max(from, 0)
    to = Math.max(to, 0)

    self.fromTo(from, to, opts)
    return self
  }

  public fromTo(
    from: number | string,
    to: number | string,
    options: types.BaseAnimationOptions
  ) {
    const self = this

    if (isArrayLike(options.css)) {
      // fill in missing offsets
      inferOffsets(options.css as types.KeyframeOptions[])
    } else {
      // convert properties to offsets
      options.css = propsToKeyframes(options.css as types.PropertyOptions)
    }

    // ensure to/from are in milliseconds (as numbers)
    const options2 = options as types.AnimationOptions
    options2.from = convertToMs(from)
    options2.to = convertToMs(to)
    options2.duration = options2.to - options2.from

    // add all targets as property keyframes
    const targets = getTargets(options.targets)
    for (let i = 0, ilen = targets.length; i < ilen; i++) {
      var target = targets[i]
      var targetConfig = head(self.targets, t2 => t2.target === target)

      if (!targetConfig) {
        targetConfig = {
          from: options2.from,
          to: options2.to,
          duration: options2.to - options2.from,
          target,
          keyframes: [],
          propOrder: {}
        }
        self.targets.push(targetConfig)
      }

      addKeyframes(targetConfig, i, options2)
    }

    // sort property keyframes
    self._sortPropKeyframes()

    // recalculate property keyframe times and total duration
    self._calcTimes()

    return self
  }

  public to(toTime: string | number, opts: types.ToAnimationOptions) {
    const self = this
    const to = convertToMs(toTime)

    let fromTime: number
    if (isDefined(opts.from)) {
      fromTime = convertToMs(opts.from)
    } else if (isDefined(opts.duration)) {
      fromTime = to - convertToMs(opts.duration)
    } else {
      fromTime = self.duration
    }

    return self.fromTo(Math.max(fromTime, 0), to, opts)
  }

  public cancel() {
    const self = this
    timeloop.off(self._tick)
    self._time = 0
    self._iteration = _
    self.playState = types.playbackState.idle
    for (let i = 0, ilen = self._animators.length; i < ilen; i++) {
      self._animators[i](CANCEL, 0, self.playbackRate)
    }
    self._animators = []
    self._trigger(CANCEL)
    self._teardown()
    return self
  }

  public finish() {
    const self = this
    self._setup()
    timeloop.off(self._tick)
    self._time = _
    self._iteration = _
    self.playState = types.playbackState.finished
    for (let i = 0, ilen = self._animators.length; i < ilen; i++) {
      self._animators[i](FINISH, _, self.playbackRate)
    }
    self._trigger(FINISH)
    return self
  }

  public on(eventName: string, listener: () => void) {
    const self = this
    const { _listeners } = self

    const listeners = _listeners[eventName] || (_listeners[eventName] = [])
    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener)
    }

    return self
  }
  public off(eventName: string, listener: () => void) {
    const self = this
    const listeners = self._listeners[eventName]
    if (listeners) {
      const indexOfListener = listeners.indexOf(listener)
      if (indexOfListener !== -1) {
        listeners.splice(indexOfListener, 1)
      }
    }
    return self
  }

  public pause() {
    const self = this
    const { currentTime, playbackRate } = self
    timeloop.off(self._tick)
    self._setup()
    self.playState = types.playbackState.paused
    for (let i = 0, ilen = self._animators.length; i < ilen; i++) {
      self._animators[i](PAUSE, currentTime, playbackRate)
    }
    self._trigger(PAUSE)
    return self
  }

  public play(iterations = 1, dir = types.direction.normal) {
    const self = this
    self._setup()
    self._iterations = iterations
    self._dir = dir

    if (
      self.playState === types.playbackState.paused ||
      (self.playState !== types.playbackState.running &&
        self.playState !== types.playbackState.pending)
    ) {
      self.playState = types.playbackState.pending
    }

    timeloop.on(self._tick)
    self._trigger(PLAY)
    return self
  }

  public reverse() {
    const self = this
    self.playbackRate = (self.playbackRate || 0) * -1

    if (self.playState === types.playbackState.running) {
      // if currently running, pause the animation and replay from that position
      self.pause().play()
    }
    return self
  }

  public seek(time: number | string) {
    const self = this
    const timeMs = convertToMs(time)
    self._time = timeMs
    for (let i = 0, ilen = self._animators.length; i < ilen; i++) {
      self._animators[i](SEEK, timeMs, self.playbackRate)
    }
  }

  public getEffects(): types.Effect[] {
    return toEffects(this.targets)
  }

  private _calcTimes() {
    const self = this
    let timelineTo = 0

    for (let i = 0, ilen = self.targets.length; i < ilen; i++) {
      const target = self.targets[i]
      const { keyframes } = target

      var targetFrom = undefined
      var targetTo = undefined

      for (let j = 0, jlen = keyframes.length; j < jlen; j++) {
        const keyframe = keyframes[j]
        if (keyframe.time < targetFrom || targetFrom === undefined) {
          targetFrom = keyframe.time
        }
        if (keyframe.time > targetTo || targetTo === undefined) {
          targetTo = keyframe.time
          if (keyframe.time > timelineTo) {
            timelineTo = keyframe.time
          }
        }
      }

      target.to = targetTo
      target.from = targetFrom
      target.duration = targetTo - targetFrom
    }
    self.duration = timelineTo
  }

  private _setup(): void {
    const self = this
    if (!self._isReady) {
      const effects = toEffects(self.targets)
      const plugins = getPlugins()
      const animations: types.AnimationController[] = []
      for (var i = 0, ilen = plugins.length; i < ilen; i++) {
        plugins[i].animate(effects, animations)
      }

      self._animators = animations
      self._isReady = true
    }
  }

  private _sortPropKeyframes() {
    const self = this
    const { targets } = self
    for (let i = 0, ilen = targets.length; i < ilen; i++) {
      targets[i].keyframes.sort(propKeyframeSort)
    }
  }

  private _teardown(): void {
    const self = this
    self._animators = []
    self._isReady = false
  }

  private _trigger = (eventName: string) => {
    const self = this
    const { _time } = self
    const listeners = self._listeners[eventName as string]
    if (listeners) {
      for (const listener of listeners) {
        listener(_time)
      }
    }
    return self
  }

  private _tick = (delta: number) => {
    const self = this
    const playState = self.playState

    // canceled
    if (playState === types.playbackState.idle) {
      self.cancel()
      return
    }
    // finished
    if (playState === types.playbackState.finished) {
      self.finish()
      return
    }
    // paused
    if (playState === types.playbackState.paused) {
      self.pause()
      return
    }
    // running/pending

    // calculate running range
    const duration = self.duration
    const iterations = self._iterations
    const playbackRate = self.playbackRate
    const isReversed = playbackRate < 0

    let time = self._time
    let iteration = self._iteration || 0

    if (self.playState === types.playbackState.pending) {
      // reset position properties if necessary
      if (
        time === _ ||
        (isReversed && time > duration) ||
        (!isReversed && time < 0)
      ) {
        // if at finish, reset to start time
        time = isReversed ? duration : 0
      }
      if (iteration === iterations) {
        // if at finish reset iterations to 0
        iteration = 0
      }
      self.playState = types.playbackState.running
    }

    time += delta * playbackRate

    // check if timeline has finished
    let hasEnded = false
    if (!inRange(time, 0, duration)) {
      self._iteration = ++iteration
      time = isReversed ? 0 : duration
      hasEnded = true
    }

    // call update
    self._iteration = iteration
    self._time = time
    self._trigger(UPDATE)

    // call tick for all animations
    for (let i = 0, ilen = self._animators.length; i < ilen; i++) {
      self._animators[i](UPDATE, time, playbackRate)
    }

    if (!hasEnded) {
      // if not ended, return early
      return
    }

    if (iterations === iteration) {
      // end the cycle
      self.finish()
      return
    }

    if (self._dir === types.direction.alternate) {
      // change direction
      self.playbackRate = (self.playbackRate || 0) * -1
    }

    // if not the last iteration, reset the clock and call tick again
    time = self.playbackRate < 0 ? duration : 0
    self._time = time
    self._tick(0)
  }
}
