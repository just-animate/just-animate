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

export type AnimationDomTarget = Node | NodeList | string
export type AnimationTarget = string | {}
export type KeyframeValue = string | number

export interface KeyframeFunction {
  (target?: any, index?: number): KeyframeValueResolver
}

export type KeyframeValueResolver = KeyframeValue | KeyframeFunction

export interface SplitTextResult {
  words: HTMLElement[]
  characters: HTMLElement[]
}

export interface AnimationController {
  (type: string, time: number, playbackRate: number): void
}

export interface Plugin {
  transform(target: TargetConfiguration, effects: PropertyEffects): void
  animate(options: Effect[], animations: AnimationController[]): void
}

export interface PropertyKeyframe {
  time: number
  prop: string
  index: number
  order: number
  value: KeyframeValueResolver
}

export interface EffectOptions {
  offset: number
  value: string | number
}
export interface PropertyEffects {
  [name: string]: EffectOptions[]
}

export interface TargetConfiguration {
  target: AnimationTarget
  propOrder: { [name: string]: number }
  from: number
  to: number
  duration: number
  keyframes: PropertyKeyframe[]
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

export interface Effect {
  target: AnimationTarget
  keyframes: Keyframe[]
  to: number
  from: number
}
