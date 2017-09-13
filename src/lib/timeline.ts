import { CANCEL, FINISH, PAUSE } from './utils/constants'
import { all, getIndex, pushDistinct } from './utils/lists'

import {
  AddAnimationOptions,
  BaseAnimationOptions,
  BaseSetOptions,
  TimelineOptions,
  TimelineEvent,
  ITimelineModel,
  ITimeline,
  PlayOptions
} from './types'

import {
  fromModel,
  updateTimeline,
  createInitial,
  appendConfig,
  updateTime,
  updateRate,
  insertConfigs,
  insertSetConfigs,
  playTimeline
} from './effects'

class Timeline implements ITimeline {
  _model?: ITimelineModel
  get duration(): number {
    return fromModel(this)._duration
  }
  get currentTime() {
    return fromModel(this)._time
  }
  set currentTime(time: number) {
    updateTime(fromModel(this), time)
  }
  get playbackRate() {
    return fromModel(this)._rate
  }
  set playbackRate(rate: number) {
    updateRate(fromModel(this), rate)
  }

  constructor(opts?: TimelineOptions) {
    this._model = createInitial(opts || {})
  }

  add(opts: AddAnimationOptions | AddAnimationOptions[]) {
    appendConfig(fromModel(this), opts)
    return this
  }
  animate(opts: AddAnimationOptions | AddAnimationOptions[]) {
    appendConfig(fromModel(this), opts)
    return this
  }
  fromTo(from: number, to: number, options: BaseAnimationOptions | BaseAnimationOptions[]) {
    insertConfigs(fromModel(this), from, to, options)
    return this
  }
  cancel() {
    updateTimeline(fromModel(this), CANCEL)
    return this
  }
  finish() {
    updateTimeline(fromModel(this), FINISH)
    return this
  }
  on(eventName: TimelineEvent, listener: (time: number) => void) { 
    subscribe(fromModel(this), eventName, listener)
    return this
  }
  off(eventName: TimelineEvent, listener: (time: number) => void) { 
    unsubscribe(fromModel(this), eventName, listener)
    return this
  }
  pause() {
    updateTimeline(fromModel(this), PAUSE)
    return this
  }
  play(options?: PlayOptions) {
    playTimeline(fromModel(this), options)
    return this
  }
  reverse() {
    this.playbackRate = (this.playbackRate || 0) * -1
    return this
  }
  seek(time: number) {
    updateTime(fromModel(this), time)
    return this
  }
  sequence(seqOptions: AddAnimationOptions[]) {
    all(seqOptions, opt => this.add(opt))
    return this
  }
  set(options: BaseSetOptions | BaseSetOptions[]) {
    insertSetConfigs(fromModel(this), options)
    return this
  }
}

/**
 * Animation timeline control.  Defines animation definition methods like .fromTo() and player controls like .play()
 */
export function timeline(opts?: TimelineOptions): ITimeline {
  return new Timeline(opts)
}

export function subscribe(model: ITimelineModel, eventName: TimelineEvent, listener: (time: number) => void) {
  const { _subs } = model
  pushDistinct(_subs[eventName] || (_subs[eventName] = []), listener)
}

export function unsubscribe(model: ITimelineModel, eventName: TimelineEvent, listener: (time: number) => void) {
  const listeners = model._subs[eventName]
  if (listeners) {
    const indexOfListener = getIndex(listeners, listener)
    if (indexOfListener !== -1) {
      listeners.splice(indexOfListener, 1)
    }
  }
}
