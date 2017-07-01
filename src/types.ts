export interface AnimationEffectTiming {
  direction?: string
  delay?: number
  duration?: number
  easing?: string
  endDelay?: number
  fill?: string
  iterationStart?: number
  iterations?: number
}

export interface Animation {
  id: string
  startTime: number
  currentTime: number
  playState: 'idle' | 'pending' | 'running' | 'paused' | 'finished'
  playbackRate: number
  onfinish: Function
  oncancel: Function

  cancel(): void
  finish(): void
  play(): void
  pause(): void
  reverse(): void
  addEventListener(eventName: string, listener: Function): void
  removeEventListener(eventName: string, listener: Function): void
}

export interface KeyframeOptions {
  offset?: number
  [val: string]: string | number | { (target?: AnimationTarget, index?: number, targets?: AnimationTarget[]): string | number }
}

export interface Keyframe {
  offset?: number
  easing?: string
  transform?: string
  [val: string]: string | number
}

export type FillMode = 'none' | 'forwards' | 'backwards' | 'both' | 'auto'
export type AnimationPlaybackState =
  | 'fatal'
  | 'idle'
  | 'pending'
  | 'running'
  | 'paused'
  | 'finished'
export type AnimationDomTarget = Node | NodeList | string
export type AnimationTarget = string | {}
export type AnimationDirection = 'normal' | 'alternate'
export type Angle = string | number
export type Color = string
export type Distance = string | number

export type KeyframeValue = string | number
export type KeyframeFunction = (target?: any, index?: number) => KeyframeValueResolver
export type KeyframeValueResolver = KeyframeValue | KeyframeFunction

export type AnimationTiming = {
  delay?: number
  duration?: number
  easing?: string
  endDelay?: number
  fill?: string
}

export type AnimationTimeContext = {
  currentTime?: number
  delta?: number
  duration?: number
  offset?: number
  computedOffset?: number
  playbackRate?: number
  target: any
  targets: any[]
  index: number
  iterations?: number
}

export type AnimationEventType =
  | 'cancel'
  | 'pause'
  | 'play'
  | 'finish'
  | 'iteration'

export type AnimationEvent = {
  cancel?: AnimationEventListener
  finish?: AnimationEventListener
  pause?: AnimationEventListener
  play?: AnimationEventListener
  update?: AnimationEventListener
  iteration?: AnimationEventListener
  [key: string]: AnimationEventListener
}
export type AnimationEventListener = {
  (ctx: AnimationTimeContext): void
}

export type CssPropertyOptions = {
  easing?: string
  [name: string]: KeyframeValueResolver | KeyframeValueResolver[]
}

export type CssKeyframeOptions = {
  offset?: number
  easing?: string
  [name: string]: KeyframeValueResolver
}

export type SplitTextResult = {
  words: HTMLElement[]
  characters: HTMLElement[]
}

export type Mapper<T1, T2> = (mapable: T1) => T2
export type Func<T1> = (mapable: T1) => T1

export interface PropertyKeyframe {
  time: number
  index: number
  value: KeyframeValueResolver | KeyframeValueResolver[]
}

export interface TargetConfiguration {
  target: AnimationTarget
  from: number 
  to: number
  duration: number
  props: { [key: string]: PropertyKeyframe[] }
}

export interface BaseAnimationOptions {
  targets: AnimationTarget | AnimationTarget[]
  css: KeyframeOptions[]
  stagger?: number | string
  delay?: number | string
  endDelay?: number | string
}

export interface ToAnimationOptions extends BaseAnimationOptions {
  duration?: number | string
  from?: number | string
}

export interface AddAnimationOptions extends BaseAnimationOptions {
  from?: number | string
  to?: number | string
  duration?: number | string
}

export interface AnimationOptions extends BaseAnimationOptions {
  from: number
  to: number
  duration: number
}

export interface EffectOptions {
  target: AnimationTarget
  keyframes: Keyframe[]
  duration: number
  to: number
  from: number
}
