import {
  D_ALTERNATIVE, D_NORMAL, S_FINISHED, S_IDLE, S_PAUSED, S_PENDING, S_RUNNING,
  _, CANCEL, FINISH, PAUSE, REVERSE, UPDATE, PLAY
} from './constants'

import { getPlugins } from './plugins'
import { resolveProperty } from './resolve-property'
import { loopOn, loopOff } from './timeloop'
import { toEffects, addPropertyKeyframes } from './effects'
import { sortBy, forEach, head, push } from './lists'
import { isDefined } from './inspect'
import { getTargets } from './get-targets'
import { max, inRange, minMax, rnd, flr } from './math'

import {
  AddAnimationOptions,
  AnimationOptions,
  BaseAnimationOptions,
  Effect,
  PropertyKeyframe,
  TargetConfiguration,
  ToAnimationOptions,
  AnimationTimelineController,
  ITimeline
} from './types'

const propKeyframeSort = sortBy<PropertyKeyframe>('time')

const timelineProto: ITimeline = {
  currentTime: _ as number,
  duration: _ as number,
  playbackRate: _ as number,
  _nextTime: _ as number,
  _state: _ as number,
  _config: _ as TargetConfiguration[],
  _effects: _ as AnimationTimelineController[],
  _times: _ as number,
  _iteration: _ as number,
  _time: _ as number,
  _rate: _ as number,
  _dir: _ as typeof D_NORMAL | typeof D_ALTERNATIVE,
  _listeners: _ as { [key: string]: { (time: number): void }[] },

  add(this: ITimeline, opts: AddAnimationOptions) {
    const { _nextTime } = this
    const hasTo = isDefined(opts.to)
    const hasFrom = isDefined(opts.from)
    const hasDuration = isDefined(opts.duration)

    // pretty exaustive rules for importing times
    let from: number, to: number
    if (hasFrom && hasTo) {
      from = opts.from
      to = opts.to
    } else if (hasFrom && hasDuration) {
      from = opts.from
      to = from + opts.duration
    } else if (hasTo && hasDuration) {
      to = opts.to
      from = to - opts.duration
    } else if (hasTo && !hasDuration) {
      from = _nextTime
      to = from + opts.to
    } else if (hasDuration) {
      from = _nextTime
      to = from + opts.duration
    } else {
      throw new Error('Missing duration')
    }

    return this.fromTo(from, to, opts)
  }, 
  fromTo(this: ITimeline, from: number, to: number, options: BaseAnimationOptions) {
    const config = this._config

    // ensure to/from are in milliseconds (as numbers)
    const options2 = options as AnimationOptions
    options2.from = from
    options2.to = to
    options2.duration = options2.to - options2.from

    // add all targets as property keyframes
    forEach(getTargets(options.targets, getPlugins()), (target, i) => {
      const delay = resolveProperty(options2.delay, target, i) || 0
      const targetConfig =
        head(config, t2 => t2.target === target) ||
        push(config, {
          from: max(options2.from + delay, 0),
          to: max(options2.to + delay, 0),
          duration: options2.to - options2.from,
          endDelay: resolveProperty(options2.endDelay, target, i) || 0,
          target,
          keyframes: [],
          propNames: []
        })

      addPropertyKeyframes(targetConfig, i, options2)
    })

    // sort property keyframes
    forEach(config, c => c.keyframes.sort(propKeyframeSort))

    // recalculate property keyframe times and total duration
    this._calcTimes()
    return this
  }, 
  to(this: ITimeline, to: number, opts: ToAnimationOptions) {
    const { duration } = this

    let fromTime: number
    if (isDefined(opts.from)) {
      fromTime = opts.from
    } else if (isDefined(opts.duration)) {
      fromTime = to - opts.duration
    } else {
      fromTime = duration
    }

    return this.fromTo(fromTime, to, opts)
  }, 
  cancel(this: ITimeline) {
    return this._update(CANCEL)
  }, 
  finish(this: ITimeline) {
    return this._update(FINISH)
  }, 
  on(this: ITimeline, eventName: string, listener: () => void) {
    const self = this
    const { _listeners } = self

    const listeners = _listeners[eventName] || (_listeners[eventName] = [])
    if (listeners.indexOf(listener) === -1) {
      push(listeners, listener)
    }

    return self
  }, 
  off(this: ITimeline, eventName: string, listener: () => void) {
    const self = this
    const listeners = self._listeners[eventName]
    if (listeners) {
      const indexOfListener = listeners.indexOf(listener)
      if (indexOfListener !== -1) {
        listeners.splice(indexOfListener, 1)
      }
    }
    return self
  }, 
  pause(this: ITimeline) {
    return this._update(PAUSE)
  }, 
  play(this: ITimeline, iterations = 1, dir: typeof D_NORMAL | typeof D_ALTERNATIVE = D_NORMAL) {
    const self = this
    self._times = iterations
    self._dir = dir
    self._state = S_RUNNING
    this._update(PLAY)
    return self
  }, 
  reverse(this: ITimeline) {
    const self = this
    self.playbackRate = (self.playbackRate || 0) * -1
    return self
  }, 
  seek(this: ITimeline, time: number) {
    this.currentTime = time
    return this
  },
  getEffects(this: ITimeline): Effect[] {
    return toEffects(this._config)
  },

  _update(this: ITimeline, type: string) {
    const self = this

    // update state and loop
    if (type === CANCEL) {
      self._state = S_IDLE
    } else if (type === FINISH) {
      self._state = S_FINISHED
      self._time = self._rate < 0 ? 0 : self.duration;
      self._iteration = _
    } else if (type === PAUSE) {
      self._state = S_PAUSED
    } else if (type === PLAY) {
      // set current time (this will automatically start playing when the _state is running)
      const isForwards = self._rate >= 0
      if (isForwards && self._time === self.duration) {
        self._time = 0
      } else if (!isForwards && self._time === 0) {
        self._time = self.duration
      }
    }

    // check current state
    const isTimelineActive = self._state === S_RUNNING
    const isTimelineInEffect = self._state !== S_IDLE
    const time = self.currentTime

    // setup effects if required
    if (isTimelineInEffect && self._effects === _) {
      self._setup()
    }

    // update effect clocks
    if (isTimelineInEffect) {
      // update effects
      forEach(self._effects, effect => {
        const { from, to } = effect
        const isAnimationActive = isTimelineActive && inRange(flr(time), from, to)
        const localTime = rnd(minMax(time - from, 0, to - from))
        effect.update(localTime, self._rate, isAnimationActive)
      })
    }

    // remove tick from loop if no timelines are active
    if (!isTimelineActive) {
      loopOff(self._tick)
    }
    if (type === PLAY) {
      loopOn(self._tick)
    }

    // teardown/destroy
    if (!isTimelineInEffect) {
      forEach(self._effects, effect => effect.cancel())
      self._time = 0
      self._iteration = _
      self._effects = _
    }

    // notify event listeners
    forEach(self._listeners[type], c => c(time))
    return self
  },
  _calcTimes(this: ITimeline) {
    const self = this
    let timelineTo = 0
    let maxNextTime = 0

    forEach(self._config, target => {
      const { keyframes } = target

      var targetFrom: number
      var targetTo: number

      forEach(keyframes, keyframe => {
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

      target.to = targetTo
      target.from = targetFrom
      target.duration = targetTo - targetFrom

      maxNextTime = max(targetTo + target.endDelay, maxNextTime)
    })

    self._nextTime = maxNextTime
    self.duration = timelineTo
  },
  _setup(this: ITimeline): void {
    const self = this
    if (!self._effects) {
      const effects = toEffects(self._config)
      const plugins = getPlugins()
      const animations: AnimationTimelineController[] = []

      forEach(effects, effect => {
        forEach(plugins, p => {
          // return false to stop the loop, undefined to continue
          if (p.isHandled(effect.target, effect.prop)) {
            const controller = p.animate(effect) as AnimationTimelineController
            if (controller) {
              controller.from = effect.from
              controller.to = effect.to
              push(animations, controller)
            }

            return false
          }
          return _
        })
      })

      self._time = self._rate < 0 ? self.duration : 0
      self._effects = animations
    }
  },
  _tick(this: ITimeline, delta: number) {
    const self = this
    const playState = self._state

    // canceled
    if (playState === S_IDLE) {
      self._update(CANCEL)
      return
    }
    // finished
    if (playState === S_FINISHED) {
      self._update(FINISH)
      return
    }
    // paused
    if (playState === S_PAUSED) {
      self._update(PAUSE)
      return
    }
    // running/pending

    // calculate running range
    const duration = self.duration
    const iterations = self._times
    const rate = self._rate
    const isReversed = rate < 0

    // set time use existing
    let time: number
    if (self._time === _) {
      time = rate < 0 ? duration : 0
    } else {
      time = self._time
    }
    let iteration = self._iteration || 0

    if (self._state === S_PENDING) {
      // reset position properties if necessary
      if (time === _ || (isReversed && time > duration) || (!isReversed && time < 0)) {
        // if at finish, reset to start time
        time = isReversed ? duration : 0
      }
      if (iteration === iterations) {
        // if at finish reset iterations to 0
        iteration = 0
      }
      self._state = S_RUNNING
    }

    time += delta * rate

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
    forEach(self._listeners[UPDATE], c => c(time))
    self._update(UPDATE)

    if (!hasEnded) {
      // if not ended, return early
      return
    }

    if (self._dir === D_ALTERNATIVE) {
      // change direction
      self._rate = (self._rate || 0) * -1
    }

    if (iterations === iteration) {
      // end the cycle
      self._update(FINISH)
      return
    }

    // if not the last iteration, reset the clock and call tick again
    self._time = self._rate < 0 ? duration : 0
    self._tick(0)
  }
};

/**
 * Animation timeline control.  Defines animation definition methods like .fromTo() and player controls like .play()
 */

export function timeline(): ITimeline {
  const self: ITimeline = Object.create(timelineProto)
  // initialize default values
  self.duration = 0
  self._nextTime = 0
  self._rate = 1
  self._time = 0
  self._dir = D_NORMAL
  self._state = S_IDLE
  self._config = []
  self._listeners = {}

  // bind tick to instance
  self._tick = self._tick.bind(self)

  // define currentTime setter/getter
  Object.defineProperty(self, 'currentTime', {
    get() {
      return self._time
    },
    set(time: number) {
      time = +time
      self._time = isFinite(time) ? time : (self._rate < 0 ? self.duration : 0)
      self._update(UPDATE)
    }
  })

  // define playbackRate setter/getter    
  Object.defineProperty(self, 'playbackRate', {
    get() {
      return self._rate
    },
    set(rate: number) {
      self._rate = +rate || 1
      self._update(REVERSE)
    }
  })

  return self
}
