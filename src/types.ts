import { IAnimation } from './waapiTypes'
import { ITimelineJSON } from './types/json'

declare global {
    interface Window {
        JA: JustAnimate
    }
}

export type Time = string | number
export type TTarget = OneOrMany<{} | string>
export type OneOrMany<T> = T | ArrayLike<T>
export type Easing = { (offset: number): number } | string
export type TimelineEvent = 'play' | 'pause' | 'cancel' | 'finish'

export type ElementProps =
    | CSSStyleDeclaration
    | HTMLElement
    | {
          // overrides from lib.d.ts
          opacity?: number
          willChange?: string
      }

/**
 *  All element properties (but only a partial)
 */
export type ElementPropSingle = Partial<ElementProps>

/**
 *  All element properties with value or keyframes
 */
export type ElementPropMany = Keyframes<ElementProps>

/**
 * value, array, or keyframe
 */
export type Keyframes<T> = { [P in keyof T]: T[P][] | { $value: T[P] | string; $offset: number; $easing?: Easing }[] }

export interface ArrayLike<T> {
    [index: number]: T
    length: number
}

export interface JustAnimate {
    useWAAPI: boolean
    mixers?: Record<string, IMixer>
    refs?: Record<string, any>
    animateTo(target: OneOrMany<Node | string>, to: Time, props: ElementPropSingle | IToOptions): void
    animateTo<T extends {}>(target: OneOrMany<T>, to: Time, props: Partial<T> | IToOptions): void
    timeline(options?: ITimelineOptions): void
}

export interface ICommonOptions {
    $delay?: number
    $easing?: Easing
}

export interface ITargetOptions extends ICommonOptions {
    $target: OneOrMany<Node | string | {}>
    $duration: number
    [key: string]: any
}

export interface IToOptions extends ICommonOptions {
    $at?: number
    $limit?: number  
} 

export type IMixer = IMixerTweenDef | IMixerKeyframeDef | IMixerTweenFunction

export interface IMixerTweenDef {
    type: 'tween'
    fn: IMixerTweenFunction
}

export interface IMixerKeyframeDef {
    type: 'keyframes'
    fn: IMixerTweenFunction
}

/**
 * Mixer function to tween between two values.  
 *  - Return the value and it will be set automatically
 *  - return nothing if the mixer has taken care of the set
 */
export interface IMixerTweenFunction {
    (a: string | number, b: string | number, target?: any, prop?: string): (offset: number) => void | string | number
}   

/**
 * Mixer function to animate keyframes.  This is intended for plugging in other animation libs or WAAPI
 *  - Must return a Player object
 */
export interface IMixerTweenFunction {
    (target?: any, prop?: string): IAnimation
}  

export interface ITimelineOptions {
    useWAAPI?: boolean
    labels?: Record<string, number>
    mixers?: Record<string, IMixer>
    refs?: Record<string, any>
}

export interface IPlayOptions {
    repeat?: number
    alternate?: string
    from?: Time
    to?: Time
}

/**
 * Controls and syncs animations
 */
export interface ITimeline {
    
    /*// PROPERTIES */
    /**
     * Current time of the timeline.  It is undefined when the timeline is idle
     */
    currentTime: number
    /**
     * Current duration of the timeline
     */
    duration: number
    /**
     * The current rate of playback.
     * - playing forward 100% = 1
     * - playing backward 100% = -1 
     */
    playbackRate: number
    /**
     * Current playstate
     */
    playState: 'running' | 'paused' | 'idle'
    /**
     * Dictionary of named times in the timeline
     */
    labels: Record<string, number>
    /**
     * Dictionary of references
     */
    refs: Record<string, any>
    /**
     * Dictionary of mixers to override default value mixers
     */
    mixers: Record<string, IMixer>

    /*// BUILDERS  */
    /**
     * Adds the animations in sequence.
     * - Use $delay with a positive value to create gaps
     * - Use $delay with a negative value to overlap events.
     * - specify "at" to insert the animations from a specific position
     */
    addSequence(animations: ITargetOptions[], at?: Time): ITimeline
    /**
     * Adds the animations on top of one another (a group animation).
     * - specify "at"to insert the animations from a specific position
     */
    addMultiple(animations: ITargetOptions[], at?: Time): ITimeline
    /**
     * Adds a Just Animate timeline to this timeline.  The sub-timeline will automatically
     * mirror this timeline's playState and playbackRate. currentTime will be set relative to
     * the play position of the this timeline
     */
    addTimeline(timeline: void, at?: Time): ITimeline
    /**
     * Adds a Web Animation API - Animation to the timeline.  The animation will automatically
     * mirror this timeline's playState and playbackRate.  currentTime will be set relative to
     * the play position of the this timeline
     */
    addTimeline(timeline: IAnimation, at?: Time): ITimeline
    /**
     * Adds a label at the current time. 
     * - To set a label at a particular time, use ```timeline.labels.myLabel = 200;``` instead
     */
    addLabel(labelName: string): ITimeline
    /**
     * Adds a delay at the current position
     */
    addDelay(time: Time): ITimeline
    /**
     * Set the value of the Element or string.  This results in a sub-millisecond tween
     */
    set(target: OneOrMany<Node | string>, duration: number, props: ElementPropSingle | IToOptions): ITimeline
    /**
     * Set the value of the object.  This results in a sub-millisecond tween
     */
    set<T extends {}>(target: OneOrMany<T>, props: Partial<T> | IToOptions, at?: number): ITimeline
    /**
     * Stagger the Node/Element targets evenly for the provided amount of time.
     * - If $limit is specified, all subsequent items will use the last stagger amount.
     * - If $delay is specified, each item shall use that amount of delay not exceeding the total stagger time
     */
    staggerTo(target: OneOrMany<Node | string>, duration: number, props: ElementPropSingle | IToOptions): ITimeline
    /**
     * Stagger the object targets evenly for the provided amount of time.
     * - If $limit is specified, all subsequent items will use the last stagger amount.
     * - If $delay is specified, each item shall use that amount of delay not exceeding the total stagger time
     */
    staggerTo<T extends {}>(target: OneOrMany<T>, duration: number, props: Partial<T> | IToOptions): ITimeline
    /**
     * Tween the Node/Element target(s) for the specified time from the last frame
     */
    to(target: OneOrMany<Node | string>, duration: number, props: ElementPropSingle | IToOptions): ITimeline
    /**
     * Tween the object target(s) for the specified time from the last frame
     */
    to<T extends {}>(target: OneOrMany<T>, duration: number, props: Partial<T> | IToOptions): ITimeline

    /*// TIMELINE CONTROLS */
    /**
     * Reverse the direction of the timeline (this.playbackRate *= -1)
     */
    reverse(): ITimeline
    /**
     * Seek to the specified time or label.
     * - If the time occurs before or after the timeline, it will be clamped
     * - If the label does not exist, it will throw an error
     * - If the timeline is not active, it will activate and move to a paused state
     */
    seek(time: Time): ITimeline
    /**
     * Play the timeline and activate all sub-timelines.  The 'play' event will be fired if the timeline is in an idle or paused state
     * - If the timeline is not active, it will activate and move to a running state
     * - If the timeline is already in a running state, it will be ignored
     * - If the from/to are specified, the currentTime will seek to those boundaries
     * - If the from/to are specified, the internal duration of the timeline will be the difference
     */
    play(options?: IPlayOptions): ITimeline
    /**
     * Shortcut function for .cancel() + .play()
     */
    restart(): ITimeline
    /**
     * Cancels the timeline and removes all removable effects.  The 'cancel' event will be called
     * - currentTime will be set to undefined
     * - playbackRate will be reset to 1
     * - all sub-timelines will be canceled
     */
    cancel(): ITimeline
    /**
     * Finish the timeline.  This promotes currentTime to the duration or 0 depending on
     * the playbackRate, alternate, and repeat.  The timeline remains active and so do all effects.
     * Calls the 'finish' event
     */
    finish(): ITimeline

    /**
     * Gets the internal keyframes
     */
    export(): ITimelineJSON
    /**
     * Replaces the internal keyframes
     */
    import(keyframes: ITimelineJSON): ITimeline
    /**
     * Subscribe to events
     */
    on(eventName: string, callback: IAction): this
    /**
     * Unsubscribe function from events
     */
    off(eventName: string, callback: IAction): this
}

export interface IObservable<TValue> {
    /**
     * Last value published
     */
    value(): TValue
    /**
     * Unhooks all subscribers and performs cleanup logic
     */
    dispose(): void
    /**
     * Provides the next value to the observable
     */
    next(n: TValue): void
    /**
     * Subscribes to each new value.  Can be set a a function or an array of functions
     */
    subscribe(observer: OneOrMany<IObserver<TValue>>): IAction
}

/**
 * An observer (or consumer) of a value
 */
export interface IObserver<T> {
    (value: T): void
}

/**
 * A simple function
 */
export interface IAction {
    (): void
}
