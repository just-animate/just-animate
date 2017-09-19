
import {
  AddAnimationOptions,
  BaseAnimationOptions,
  BaseSetOptions,
  TimelineOptions,
  TimelineEvent,
  ITimeline,
  PlayOptions,
  AnimationOptions
} from './core/types'
 
import { uuid } from './utils/uuid'
import { all } from './utils/lists'
import {
  CANCEL,
  DESTROY,
  FINISH,
  PAUSE,
  UPDATE_RATE,
  UPDATE_TIME,
  REVERSE,
  PLAY,
  APPEND,
  SET,
  INSERT
} from './actions'
import { dispatch, addState, getState, on, off } from './store'

const timelineProto: ITimeline = {
  get state(): number {
    return getState(this.id).state;
  },
  get duration(): number {
    return getState(this.id).duration
  },
  get currentTime() {
    return getState(this.id).time
  },
  set currentTime(time: number) {
    dispatch(UPDATE_TIME, this.id, time)
  },
  get playbackRate() {
    return getState(this.id).rate
  },
  set playbackRate(rate: number) {
    dispatch(UPDATE_RATE, this.id, rate)
  },
  add(opts: AddAnimationOptions | AddAnimationOptions[]) {
    dispatch(APPEND, this.id, opts)
    return this
  },
  animate(opts: AddAnimationOptions | AddAnimationOptions[]) {
    dispatch(APPEND, this.id, opts)
    return this
  },
  fromTo(from: number, to: number, options: BaseAnimationOptions | BaseAnimationOptions[]) {
    all(options as AnimationOptions[], options2 => {
      options2.to = to
      options2.from = from
    })
    dispatch(INSERT, this.id, options) 
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
  on(name: TimelineEvent, fn: (time: number) => void) { 
    on(this.id, name, fn) 
    return this
  },
  once(eventName: TimelineEvent, listener: (time: number) => void) {
    const self = this
    self.on(eventName, function s(time) {
      self.off(eventName, s)
      listener(time)
    }) 
    return self
  },
  off(name: TimelineEvent, fn: (time: number) => void) { 
    off(this.id, name, fn) 
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
    all(seqOptions, opt => dispatch(APPEND, this.id, opt))
    return this
  },
  set(opts: BaseSetOptions | BaseSetOptions[]) {
    dispatch(SET, this.id, opts)
    return this
  }
}

/**
 * Animation timeline control.  Defines animation definition methods like .fromTo() and player controls like .play()
 */
export function timeline(opts?: TimelineOptions): ITimeline {
  const t1 = Object.create(timelineProto)
  opts = opts || {}
  
  opts.id = opts.id || uuid()
  t1.id = opts.id
  addState(opts)
  return t1
}
