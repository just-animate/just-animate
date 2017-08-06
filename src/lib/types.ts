export interface PropertyOptions {
  [name: string]: PropertyResolver<PropertyValue> | PropertyResolver<PropertyValue>[]
}

export interface Keyframe {
  offset: number
  value: string | number
}

export type AnimationTarget = any
export type KeyframeValue = string | number

export interface PropertyFunction<T> {
  (target: any, index: number, len: number): T
}

export interface PropertyObject {
  value: string | number
  offset?: number
  easing?: string
}

export type PropertyValue = string | number | PropertyObject

export type PropertyResolver<T> = T | PropertyFunction<T>

export interface AnimationController {
  cancel(): void
  update(localTime: number, playbackRate: number, isActive: boolean): void
}

export interface AnimationTimelineController extends AnimationController {
  from: number
  to: number
}

export interface JustAnimatePlugin {
  name: string 
  onWillAnimate?: { (target: TargetConfiguration, effects: PropertyEffects): void }
  animate(effect: Effect): AnimationController 
  getValue(target: AnimationTarget, key: string): string | number
}

export interface PropertyKeyframe {
  time: number
  prop: string
  index: number
  value: string | number
}
export interface PropertyEffects {
  [name: string]: {
    [offset: number]: string | number
  }
}

export interface TargetConfiguration {
  target: AnimationTarget
  targetLength: number
  propNames: string[]
  from: number
  to: number
  endDelay: number
  duration: number
  keyframes: PropertyKeyframe[]
}

export interface BaseAnimationOptions {
  targets: AnimationTarget | AnimationTarget[]
  stagger?: number
  delay?: PropertyResolver<number>
  endDelay?: PropertyResolver<number>
  props?: PropertyOptions
  web?: PropertyOptions
}

export interface AddAnimationOptions extends BaseAnimationOptions {
  from?: number
  to?: number
  duration?: number
}

export interface AnimationOptions {
  from: number
  to: number
  duration: number
  targets: AnimationTarget[] 
  stagger?: number
  delay?: PropertyResolver<number>
  endDelay?: PropertyResolver<number>
  props?: PropertyOptions
  web?: PropertyOptions
}

export interface Effect {
  target: AnimationTarget
  plugin: string
  prop: string;
  keyframes: Keyframe[]
  to: number
  from: number
}

/**
 * Adds an animation at the end of the timeline, unless from/to are specified
 * @param opts the animation definition
 */
export interface ITimeline {
  currentTime?: number
  duration?: number
  playbackRate?: number
  _nextTime?: number
  _state?: number
  _configs?: {
    [plugin: string]: TargetConfiguration[]
  }
  _effects?: AnimationTimelineController[]
  _repeat?: number
  _iteration?: number
  _time?: number
  _rate?: number
  _alternate?: boolean
  _listeners?: { [key: string]: { (time: number): void }[] }
  _tick?: (delta: number) => void
  /**
   * Adds an animation at the end of the timeline, unless from/to are specified
   * @param opts the animation definition
   */
  add( opts: AddAnimationOptions): this
  /**
   * Defines an animation that occurs starting at "from" and ending at "to".
   *
   * Note: The delay, endDelay, and stagger properties may shift the from/to times
   * @param from the starting time in milliseconds
   * @param to the ending time in milliseconds
   * @param options the animation definition.
   */
  fromTo( from: number, to: number, options: BaseAnimationOptions): this

  /**
   * Cancels an animation, removes all effects, and resets internal state
   */
  cancel(): this

  /**
   * Finishes an animation.  If the animation has never been active, this will
   * activate effects
   * - If playbackRate is 0 or more, the animation will seek to duration.
   * - If playbackRate is less than 0, the animation will seek to 0
   */
  finish(): this

  /**
   * Register for timeline events
   * @param eventName timeline event name
   * @param listener callback for when the event occurs
   */
  on( eventName: string, listener: (time: number) => void): this

  /**
   * Unregister for timeline events
   * @param eventName timeline event name
   * @param listener callback to unregister
   */
  off( eventName: string, listener: (time: number) => void): this

  /**
   * Pauses execution of the animation. If the animation has never been active, this will
   * activate effects
   */
  pause(): this
  /**
   * Plays the animation until finished.  If the animation has never been active, this will activate the effects.
   * @param iterations number of iterations to play the animation.  Use Infinity to loop forever
   * @param dir the direction the animation should play.  "normal" (default) or "alternate" (yoyo)
   */
  play(options?: {repeat?: number, alternate?: boolean }): this

  /**
   * Reverses the animation playbackRate.  If the animation is currently playing, it will reverse the animation
   */
  reverse(): this

  /**
   * Seeks to a specific time.  If the animation is not active, this will activate effects.
   * @param time the time in milliseconds to seek to.
   */
  seek(time: number): this

  /**
   * Gets the pre-processed effects of the current configuration.  This is mostly used for testing purposes.
   */
  getEffects(): Effect[]
}
