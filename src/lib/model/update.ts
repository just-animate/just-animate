import { getModel, destroyModel } from './store'
import {
  S_INACTIVE,
  S_STARTING,
  S_PLAYING,
  S_PAUSED,
  S_FINISHED,
  CANCEL,
  FINISH,
  PAUSE,
  _,
  UPDATE,
  RATE,
  PLAY
} from '../utils/constants'
import { inRange, minMax, flr, max } from '../utils/math'
import { publish, unsubscribeAll } from '../dispatcher'
import { PlayOptions, ITimelineModel, AnimationPlayer } from '../types'
import { all, push } from '../utils/lists'
import { loopOff, loopOn } from './timeloop'
import { getEffects } from './effects'
import { plugins } from '../plugins'

export function tick(id: string, delta: number) {
  const model = getModel(id)

  // calculate running range
  const duration = model.duration
  const repeat = model.repeat
  const rate = model.rate
  const isReversed = rate < 0

  // set time use existing
  let time = model.time === _ ? (rate < 0 ? duration : 0) : model.time

  let iteration = model.round || 0

  if (model.state === S_STARTING) {
    model.state = S_PLAYING

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
  model.time = time
  model.round = iteration  

  if (iterationEnded && repeat === iteration) {
    // end the cycle
    finishModel(model.id)
    return
  }

  // if not the last iteration reprocess this tick from the new starting point/direction
  updateModel(model.id)
}

export function cancelModel(id: string) {
  const model = getModel(id)
  
  all(model.players, effect => effect.cancel())

  model.state = S_INACTIVE
  model.time = _
  model.round = _
  model.players = _
  
  loopOff(id)
  publish(model.id, CANCEL, _)
}

export function pauseModel(id: string) {
  const model = getModel(id)
  
  model.state = S_PAUSED
  
  loopOff(id)
  updateEffects(model)
  publish(id, PAUSE, model.time)
}

export function onDestroy(id: string) {
  cancelModel(id) 
  unsubscribeAll(id) 
  destroyModel(id) 
}

export function finishModel(id: string) {
  const model = getModel(id)
  
  model.round = 0
  model.state = S_FINISHED
  
  if (!model.yoyo) {
    model.time = model.rate < 0 ? 0 : model.duration
  }
  
  loopOff(id)
  updateEffects(model)
  publish(id, UPDATE, model.time)
  publish(id, FINISH, model.time)
  
  if (model.destroy) {
    onDestroy(id)
  }
}

export function updateModel(id: string) {
  const model = getModel(id)
  updateEffects(model) 
  publish(model.id, UPDATE, model.time)
}

function updateEffects(model: ITimelineModel) {
  // check current state
  const isActive = model.state === S_PLAYING

  // remove tick from loop if no timelines are active
  if (!isActive) {
    loopOff(model.id)
  }

  // setup effects if required
  if (model.players === _) {
    setupEffects(model)
  }

  // update effects
  all(model.players, effect => {
    const { from, to } = effect
    const isAnimationActive = isActive && inRange(flr(model.time), from, to)
    const offset = minMax((model.time - from) / (to - from), 0, 1)

    effect.update(offset, model.rate, isAnimationActive)
  })
}

export function reverseTimeline(id: string) {
  updateRate(id, (getModel(id).rate || 0) * -1)
}
export function playTimeline(id: string, options: PlayOptions) {
  const model = getModel(id)
  if (options) {
    model.repeat = options.repeat
    model.yoyo = options.alternate === true
    model.destroy = options.destroy
  }

  model.repeat = model.repeat || 1
  model.yoyo = model.yoyo || false
  model.state = S_PLAYING 
  
  // set current time (this will automatically start playing when the state is running)
  const isForwards = model.rate >= 0
  if (isForwards && model.time === model.duration) {
    model.time = 0
  } else if (!isForwards && model.time === 0) {
    model.time = model.duration
  }

  loopOn(model.id)
  updateEffects(model) 
  publish(model.id, PLAY, model.time)
}

export function updateTime(id: string, time: number) {
  const model = getModel(id)
  time = +time
  model.time = isFinite(time) ? time : model.rate < 0 ? model.duration : 0
  updateModel(id)
}

export function updateRate(id: string, rate: number) {
  const model = getModel(id)
  model.rate = +rate || 1
  updateEffects(model) 
  publish(model.id, RATE, model.time)
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
  model.duration = max.apply(_, animations.filter(a => isFinite(a.to)).map(a => a.to))

  model.players = animations
  updateTime(model.id, _)
}
