
import {
  AddAnimationOptions,
  BaseAnimationOptions,
  BaseSetOptions,
  TimelineOptions,
  TimelineEvent,
  ITimeline,
  PlayOptions,
  AnimationOptions,
  TimelineHandler
} from './core/types'
 
import { uuid } from './utils/uuid'
import { all } from './utils/lists'
import {
  CANCEL,
  DESTROY,
  FINISH,
  PAUSE,
  UPDATE_RATE,
  SEEK,
  REVERSE,
  PLAY,
  APPEND,
  SET,
  INSERT,
  SET_LABEL,
  CLEAR_LABEL
} from './actions'
import { dispatch, addState, getState, on, off } from './store' 
import { _ } from './utils/constants'

declare const Promise: PromiseConstructorLike

class Timeline implements ITimeline {
  public id: string
  public get isActive(): boolean {
    return !!getState(this.id).timing.active;
  }
  public get isPlaying(): boolean {
    return !!getState(this.id).timing.playing;
  }
  public get duration(): number {
    const { cursor, timing} = getState(this.id)
    return timing.active ? timing.duration : cursor;
  }
  public get currentTime() {
    return getState(this.id).timing.time
  }
  public set currentTime(time: number) {
    dispatch(SEEK, this.id, time)
  }
  public get playbackRate() {
    return getState(this.id).timing.rate
  }
  public set playbackRate(rate: number) {
    dispatch(UPDATE_RATE, this.id, rate)
  }
  
  constructor(opts?: TimelineOptions) {
    opts = opts || {} 
    this.id = (opts.id = opts.id || uuid())
    addState(opts)
  }
  
  public add(opts: AddAnimationOptions | AddAnimationOptions[]) {
    dispatch(APPEND, this.id, opts)
    return this
  }
  public animate(opts: AddAnimationOptions | AddAnimationOptions[]) {
    dispatch(APPEND, this.id, opts)
    return this
  }
  public fromTo(from: number, to: number, options: BaseAnimationOptions | BaseAnimationOptions[]) {
    all(options as AnimationOptions[], options2 => {
      options2.to = to
      options2.from = from
    })
    dispatch(INSERT, this.id, options) 
    return this
  }
  public cancel() {
    dispatch(CANCEL, this.id)
    return this
  }
  public destroy() {
    dispatch(DESTROY, this.id)
  }
  public finish() {
    dispatch(FINISH, this.id)
    return this
  }
  public on(name: TimelineEvent, fn: TimelineHandler) { 
    on(this.id, name, fn, this) 
    return this
  }
  public once(eventName: TimelineEvent): PromiseLike<ITimeline>
  public once(labelName: string): PromiseLike<ITimeline>
  public once(eventName: TimelineEvent, listener: TimelineHandler): this
  public once(labelName: string, listener: TimelineHandler): this
  public once(eventName: TimelineEvent, handler?: TimelineHandler) {
    const self = this
    const callback = (resolve: TimelineHandler) => {
      self.on(eventName, function s() {
        self.off(eventName, s)
        resolve(self)
      })
    };
    
    if (arguments.length === 2) {
      callback(handler)
      return self
    }
    
    return new Promise<ITimeline>(callback)
  }
  public off(name: TimelineEvent, fn: TimelineHandler) { 
    off(this.id, name, fn) 
    return this
  }
  public pause() {
    dispatch(PAUSE, this.id) 
    return this
  }
  public play(options?: PlayOptions) { 
    dispatch(PLAY, this.id, options)
    return this
  }
  public reverse() {
    dispatch(REVERSE, this.id)
    return this
  }
  public seek(time: number | string) {
    dispatch(SEEK, this.id, time)
    return this
  }
  public sequence(seqOptions: AddAnimationOptions[]) {
    all(seqOptions, opt => dispatch(APPEND, this.id, opt))
    return this
  }
  public set(opts: BaseSetOptions | BaseSetOptions[]) {
    dispatch(SET, this.id, opts)
    return this
  }
  public getLabel(name: string) {
    return getState(this.id).labels[name] || _
  }
  public setLabel(name: string, time?: number) {
    dispatch(SET_LABEL, this.id, { name, time })
    return this;
  }
  public clearLabel(name: string) {
    dispatch(CLEAR_LABEL, this.id, name)
    return this;
  }
}

/**
 * Animation timeline control.  Defines animation definition methods like .fromTo() and player controls like .play()
 */
export function timeline(opts?: TimelineOptions): ITimeline {
  return new Timeline(opts)
}
