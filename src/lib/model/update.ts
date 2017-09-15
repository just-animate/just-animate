import { getModel } from './store' 
import {
  S_PAUSED,
  S_FINISHED,
  S_IDLE,
  CANCEL,
  FINISH,
  PAUSE,
  S_PENDING,
  S_RUNNING,
  _,
  UPDATE,
  RATE,
  PLAY
} from '../utils/constants'
import { inRange, minMax, flr, max } from '../utils/math'
import { publish } from '../dispatcher'
import { PlayOptions, ITimelineModel, AnimationPlayer } from '../types'
import { all, push } from '../utils/lists'
import { loopOff, loopOn } from './timeloop'
import { getEffects } from './effects'
import { plugins } from '../plugins'

export function tick(id: string, delta: number) {
    const model = getModel(id) 
    const playState = model.state
  
    // canceled
    if (playState === S_IDLE) {
      updateTimeline(id, CANCEL)
      return
    }
    // finished
    if (playState === S_FINISHED) {
      updateTimeline(id, FINISH)
      return
    }
    // paused
    if (playState === S_PAUSED) {
      updateTimeline(id, PAUSE)
      return
    }
  
    // calculate running range
    const duration = model.duration
    const repeat = model.repeat
    const rate = model.rate
    const isReversed = rate < 0
  
    // set time use existing
    let time = model.time === _ ? (rate < 0 ? duration : 0) : model.time
  
    let iteration = model.round || 0
  
    if (model.state === S_PENDING) {
      model.state = S_RUNNING
  
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
      model.round = ++iteration
      time = isReversed ? 0 : duration
      iterationEnded = true
  
      // reverse direction on alternate
      if (model.yoyo) {
        model.rate = (model.rate || 0) * -1
      }
  
      // reset the clock
      time = model.rate < 0 ? duration : 0
    }
  
    // call update
    model.round = iteration
    model.time = time
  
    if (!iterationEnded) {
      // if not ended, return early 
      publish(model.id, UPDATE, model.time)
      updateTimeline(id, UPDATE)
      return
    }
  
    if (repeat === iteration) {
      // end the cycle
      updateTimeline(id, FINISH)
      return
    }
  
    // if not the last iteration reprocess this tick from the new starting point/direction
    publish(model.id, UPDATE, model.time)
    updateTimeline(id, UPDATE)
  }

export function updateTimeline(id: string, type: string) {
  const model = getModel(id)
  
  // update state and loop
  if (type === CANCEL) {
    model.round = 0
    model.state = S_IDLE
  } else if (type === FINISH) {
    model.round = 0
    model.state = S_FINISHED
    if (!model.yoyo) {
      model.time = model.rate < 0 ? 0 : model.duration
    }
  } else if (type === PAUSE) {
    model.state = S_PAUSED
  } else if (type === PLAY) {
    // set current time (this will automatically start playing when the state is running)
    const isForwards = model.rate >= 0
    if (isForwards && model.time === model.duration) {
      model.time = 0
    } else if (!isForwards && model.time === 0) {
      model.time = model.duration
    }
  }

  // check current state
  const isTimelineActive = model.state === S_RUNNING
  const isTimelineInEffect = model.state !== S_IDLE

  // setup effects if required
  if (isTimelineInEffect && model.players === _) {
    setupEffects(model)
  }
  
  const time = model.time
  const rate = model.rate

  // update effect clocks
  if (isTimelineInEffect) {
    // update effects
    all(model.players, effect => {
      const { from, to } = effect
      const isAnimationActive = isTimelineActive && inRange(flr(time), from, to)
      const offset = minMax((time - from) / (to - from), 0, 1)

      effect.update(offset, rate, isAnimationActive)
    })
  }

  // remove tick from loop if no timelines are active
  if (!isTimelineActive) {
    loopOff(model.id)
  }
  if (type === PLAY) {
    loopOn(model.id)
  }

  // teardown/destroy
  if (!isTimelineInEffect) {
    all(model.players, effect => effect.cancel())
    model.time = 0
    model.round = _
    model.players = _
  }

  // call extra update event on finish
  if (type === FINISH) {
    publish(model.id, UPDATE, model.time)
  }

  // notify event listeners 
  publish(model.id, type, model.time)
}

export function reverseTimeline(id: string) {
  updateRate(id, (getModel(id).rate || 0) * -1)
}
export function playTimeline(id: string, options: PlayOptions) {
  const model = getModel(id)
  if (options) {
    model.repeat = options.repeat
    model.yoyo = options.alternate === true
  }

  model.repeat = model.repeat || 1
  model.yoyo = model.yoyo || false
  model.state = S_RUNNING
  updateTimeline(model.id, PLAY)
}

export function updateTime(id: string, time: number) {
  const model = getModel(id)
  time = +time
  model.time = isFinite(time) ? time : model.rate < 0 ? model.duration : 0
  updateTimeline(id, UPDATE)
}

export function updateRate(id: string, rate: number) {
  const model = getModel(id)
  model.rate = +rate || 1
  updateTimeline(id, RATE)
}

function setupEffects(model: ITimelineModel) {
  if (model.players) {
    return
  }
 
  const animations: AnimationPlayer[] = []

  all(getEffects(model), effect => {
    const controller = plugins[effect.plugin].animate(effect) as AnimationPlayer
    if (controller) {
      // controller.config = effect.config
      controller.from = effect.from
      controller.to = effect.to
      push(animations, controller)
    }
  })
  
  // change duration to max to
  model.duration = max.apply(_, animations
    .filter(a => isFinite(a.to))
    .map(a => a.to))
  
  model.players = animations
  updateTime(model.id, _) 
}
