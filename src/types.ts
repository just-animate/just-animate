
export interface KeyframeOptions {
  offset?: number
  [val: string]: KeyframeValueResolver
}

export interface PropertyOptions {
  [name: string]: KeyframeValueResolver | KeyframeValueResolver[]
}

export interface Keyframe {
  offset?: number
  [val: string]: string | number
}

export const enum AnimationPlaybackState {
  fatal = 0,
  idle = 1,
  pending = 2,
  running = 3,
  paused = 4,
  finished = 5
}
  
export type AnimationDomTarget = Node | NodeList | string
export type AnimationTarget = string | {}

export const enum AnimationDirection {
  normal = 0,
  alternate = 1
}

export type KeyframeValue = string | number

export interface KeyframeFunction {
  (target?: any, index?: number): KeyframeValueResolver
}

export type KeyframeValueResolver = KeyframeValue | KeyframeFunction

export type AnimationEventType =
  | 'cancel'
  | 'pause'
  | 'play'
  | 'finish'
  | 'iteration'

export interface SplitTextResult {
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
