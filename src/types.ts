
export interface KeyframeOptions {
  offset?: number
  [val: string]: KeyframeValueResolver
}

export interface PropertyOptions {
  [name: string]: KeyframeValueResolver | KeyframeValueResolver[]
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

export interface AnimationTimeContext {
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

export interface PropertyHandler {
  convert?(prop: { name: string, value: string | number }): void
  merge?(name: string, values: string[]): void
}

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
  css: KeyframeOptions[] | PropertyOptions
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
  targets: AnimationTarget[]
  css: KeyframeOptions[]
  stagger?: number
  delay?: number
  endDelay?: number
}

export interface EffectOptions {
  target: AnimationTarget
  keyframes: Keyframe[]
  to: number
  from: number
}
