export interface KeyframeOptions {
  offset?: number
  [val: string]: KeyframeValueResolver<string | number>
}

export interface PropertyOptions {
  [name: string]: KeyframeValueResolver<string | number> | KeyframeValueResolver<string | number>[]
}

export interface Keyframe {
  offset: number
  value: string | number
}

export type AnimationTarget = any
export type KeyframeValue = string | number

export interface KeyframeFunction<T> {
  (target?: any, index?: number): KeyframeValueResolver<T>
}

export type KeyframeValueResolver<T> = T | KeyframeFunction<T>

export interface AnimationController {
  cancel(): void
  update(localTime: number, playbackRate: number, isActive: boolean): void
}

export interface AnimationTimelineController extends AnimationController {
  from: number
  to: number
}

export interface Plugin {
  onWillAnimate?: { (target: TargetConfiguration, effects: PropertyEffects): void }

  animate(effect: Effect): AnimationController
  isHandled(target: AnimationTarget, propName: string): boolean  
  getValue(target: AnimationTarget, key: string): string | number
  getTargets(selector: string): any[]
}

export interface PropertyKeyframe {
  time: number
  prop: string
  index: number
  value: KeyframeValueResolver<string | number>
}
export interface PropertyEffects {
  [name: string]: {
    [offset: number]: string | number
  }
}

export interface TargetConfiguration {
  target: AnimationTarget
  propNames: string[]
  from: number
  to: number
  endDelay: number
  duration: number
  keyframes: PropertyKeyframe[]
}

export interface BaseAnimationOptions {
  targets: AnimationTarget | AnimationTarget[]
  props: KeyframeOptions[] | PropertyOptions
  stagger?: number
  delay?: KeyframeValueResolver<number>
  endDelay?: KeyframeValueResolver<number>
}

export interface ToAnimationOptions extends BaseAnimationOptions {
  duration?: number
  from?: number
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
  props: PropertyOptions | KeyframeOptions[]
  stagger?: number
  delay?: KeyframeValueResolver<number>
  endDelay?: KeyframeValueResolver<number>
}

export interface Effect {
  target: AnimationTarget
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
  _config?: TargetConfiguration[]
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
   * Defines an animation ending at the "to" parameter.
   *
   * The following rules are used to find the starting point:
   * - If "from" is not provided, "duration" is used instead.
   * - If neither "from" nor "duration" are specified, the duration of the animation is used as the starting point.
   *
   * @param to the end time in milliseconds
   * @param opts the animation definition
   */
  to( to: number, opts: ToAnimationOptions): this

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
