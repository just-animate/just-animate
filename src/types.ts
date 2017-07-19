export interface KeyframeOptions {
  offset?: number
  [val: string]: KeyframeValueResolver<string | number>
}

export interface PropertyOptions {
  [name: string]: KeyframeValueResolver<string | number> | KeyframeValueResolver<string | number>[]
}

export interface Keyframe {
  offset?: number
  [val: string]: string | number
}

export type AnimationTarget = any
export type KeyframeValue = string | number

export interface KeyframeFunction<T> {
  (target?: any, index?: number): KeyframeValueResolver<T>
}

export type KeyframeValueResolver<T> = T | KeyframeFunction<T>

export interface SplitTextResult {
  words: HTMLElement[]
  characters: HTMLElement[]
}

export interface AnimationController {
  (type: string, time: number, playbackRate: number): void
}

export interface Plugin {
  animate(options: Effect[], animations: AnimationController[]): void  
  resolve(selector: string): any[];
  transform(target: TargetConfiguration, effects: PropertyEffects): void
}

export interface PropertyKeyframe {
  time: number
  prop: string
  index: number
  order: number
  value: KeyframeValueResolver<string | number>
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
  propNames: string[]
  from: number
  to: number
  endDelay: number
  duration: number
  keyframes: PropertyKeyframe[]
}

export interface BaseAnimationOptions {
  targets: AnimationTarget | AnimationTarget[]
  css: KeyframeOptions[] | PropertyOptions
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
  css: PropertyOptions | KeyframeOptions[]
  stagger?: number
  delay?: KeyframeValueResolver<number>
  endDelay?: KeyframeValueResolver<number>
}

export interface Effect {
  target: AnimationTarget
  keyframes: Keyframe[]
  to: number
  from: number
}
