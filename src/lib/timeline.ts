import { CANCEL, FINISH, PAUSE } from './utils/constants'
import { all } from './utils/lists'

import {
  AddAnimationOptions,
  BaseAnimationOptions,
  BaseSetOptions,
  TimelineOptions,
  TimelineEvent, 
  ITimeline,
  PlayOptions
} from './types'
 
import { createModel, getModel, destroyModel } from './model/store'
import { unsubscribe, subscribe, unsubscribeAll } from './dispatcher'
import { updateTime, updateRate, updateTimeline, playTimeline, reverseTimeline } from './model/update'
import { appendConfig, insertConfigs, insertSetConfigs } from './model/config'

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
    updateTime(this.id, time)
  },
  get playbackRate() {
    return getModel(this.id).rate
  },
  set playbackRate(rate: number) {
    updateRate(this.id, rate)
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
    updateTimeline(this.id, CANCEL)
    return this
  },
  destroy() {
    updateTimeline(this.id, CANCEL)
    unsubscribeAll(this.id)
    destroyModel(this.id) 
  },
  finish() {
    updateTimeline(this.id, FINISH)
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
    updateTimeline(this.id, PAUSE)
    return this
  },
  play(options?: PlayOptions) { 
    const self = this
    if (options && options.destroy) {
      self.on('finish', () => self.destroy())
    }
    
    playTimeline(self.id, options)
    return self
  },
  reverse() {
    reverseTimeline(this.id)
    return this
  },
  seek(time: number) {
    updateTime(this.id, time)
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
