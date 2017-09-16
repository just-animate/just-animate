
import {
  AddAnimationOptions,
  BaseAnimationOptions,
  BaseSetOptions,
  TimelineOptions,
  TimelineEvent, 
  ITimeline,
  PlayOptions
} from './core/types'
 
import { unsubscribe, subscribe } from './core/events'
import { dispatch } from './core/broker'
import { appendConfig, insertConfigs, insertSetConfigs } from './model/config'
import { createModel, getModel } from './model/store'
import { all } from './utils/lists'
import { CANCEL, DESTROY, FINISH, PAUSE, UPDATE_RATE, UPDATE_TIME, REVERSE, PLAY } from './utils/constants'

const timelineProto: ITimeline = {
  get state(): number {
    return getModel(this.id).state;
  },
  get duration(): number {
    return getModel(this.id).duration
  },
  get currentTime() {
    return getModel(this.id).time
  },
  set currentTime(time: number) {
    dispatch(UPDATE_TIME, this.id, time)
  },
  get playbackRate() {
    return getModel(this.id).rate
  },
  set playbackRate(rate: number) {
    dispatch(UPDATE_RATE, this.id, rate)
  },
  add(opts: AddAnimationOptions | AddAnimationOptions[]) {
    appendConfig(this.id, opts)
    return this
  },
  animate(opts: AddAnimationOptions | AddAnimationOptions[]) {
    appendConfig(this.id, opts)
    return this
  },
  fromTo(from: number, to: number, options: BaseAnimationOptions | BaseAnimationOptions[]) {
    insertConfigs(this.id, from, to, options)
    return this
  },
  cancel() {
    dispatch(CANCEL, this.id)
    return this
  },
  destroy() {
    dispatch(DESTROY, this.id)
  },
  finish() {
    dispatch(FINISH, this.id)
    return this
  },
  on(eventName: TimelineEvent, listener: (time: number) => void) { 
    subscribe(this.id, eventName, listener)
    return this
  },
  once(eventName: TimelineEvent, listener: (time: number) => void) {
    const id = this.id
    subscribe(id, eventName, function s(time) {
      unsubscribe(id, eventName, s)
      listener(time)
    })
    return this
  },
  off(eventName: TimelineEvent, listener: (time: number) => void) { 
    unsubscribe(this.id, eventName, listener)
    return this
  },
  pause() {
    dispatch(PAUSE, this.id) 
    return this
  },
  play(options?: PlayOptions) { 
    dispatch(PLAY, this.id, options)
    return this
  },
  reverse() {
    dispatch(REVERSE, this.id)
    return this
  },
  seek(time: number) {
    dispatch(UPDATE_TIME, this.id, time)
    return this
  },
  sequence(seqOptions: AddAnimationOptions[]) {
    all(seqOptions, opt => appendConfig(this.id, opt))
    return this
  },
  set(options: BaseSetOptions | BaseSetOptions[]) {
    insertSetConfigs(this.id, options)
    return this
  }
}

/**
 * Animation timeline control.  Defines animation definition methods like .fromTo() and player controls like .play()
 */
export function timeline(opts?: TimelineOptions): ITimeline {
  const t1 = Object.create(timelineProto)
  t1.id = createModel(opts || {})
  return t1
}
