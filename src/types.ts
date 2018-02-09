import { IAnimation } from './waapiTypes'

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
        willChange?: keyof CSSStyleDeclaration
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
    animateTo(target: OneOrMany<Node | string>, to: Time, props: ElementPropSingle | IToOptions): ITimeline
    animateTo<T extends {}>(target: OneOrMany<T>, to: Time, props: Partial<T> | IToOptions): ITimeline
    timeline(options?: ITimelineOptions): ITimeline
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
}

export interface IStaggerToOptions extends IToOptions {
    $limit?: number
}

export interface IMixer<T extends {} = {}> {
    (a: T, b: T): (offset: number) => any
}

export interface ITimelineOptions {
    useWAAPI?: boolean
    labels?: Record<string, number>
    mixers?: Record<string, IMixer>
    refs?: Record<string, any>
}

export interface ILabels {
    /**
     * Subscribe function to a label
     */
    on(key: string, callback: () => any): void
    /**
     * Unsubscribe function from a label
     */
    off(key: string, callback: () => any): void
    /**
     * Get a promise the next time the label occurs.  Useful for await/async style code or chaining promises
     */
    when(key: string): Promise<void>
    [key: string]: number | Function
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
     * Current playstate
     */
    playState: 'running' | 'paused' | 'idle'
    /**
     * Dictionary of named times in the timeline
     */
    labels: ILabels
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
    addSequence(animations: ITargetOptions[], at?: Time): this
    /**
     * Adds the animations on top of one another (a group animation).
     * - specify "at"to insert the animations from a specific position
     */
    addMultiple(animations: ITargetOptions[], at?: Time): this
    /**
     * Adds a Just Animate timeline to this timeline.  The sub-timeline will automatically
     * mirror this timeline's playState and playbackRate. currentTime will be set relative to
     * the play position of the this timeline
     */
    addTimeline(timeline: ITimeline, at?: Time): this
    /**
     * Adds a Web Animation API - Animation to the timeline.  The animation will automatically
     * mirror this timeline's playState and playbackRate.  currentTime will be set relative to
     * the play position of the this timeline
     */
    addTimeline(timeline: IAnimation, at?: Time): this
    /**
     * Adds a delay at the current position
     */
    delay(time: Time): this
    /**
     * Set the value of the Element or string.  This results in a sub-millisecond tween
     */
    set(target: OneOrMany<Node | string>, to: Time, props: ElementPropSingle | IToOptions): this
    /**
     * Set the value of the object.  This results in a sub-millisecond tween
     */
    set<T extends {}>(target: OneOrMany<T>, to: Time, props: Partial<T> | IToOptions): this
    /**
     * Stagger the Node/Element targets evenly for the provided amount of time.
     * - If $limit is specified, all subsequent items will use the last stagger amount.
     * - If $delay is specified, each item shall use that amount of delay not exceeding the total stagger time
     */
    staggerTo(target: OneOrMany<Node | string>, to: Time, props: ElementPropSingle | IStaggerToOptions): this
    /**
     * Stagger the object targets evenly for the provided amount of time.
     * - If $limit is specified, all subsequent items will use the last stagger amount.
     * - If $delay is specified, each item shall use that amount of delay not exceeding the total stagger time
     */
    staggerTo<T extends {}>(target: OneOrMany<T>, to: Time, props: Partial<T> | IStaggerToOptions): this
    /**
     * Tween the Node/Element target(s) for the specified time from the last frame
     */
    to(target: OneOrMany<Node | string>, to: Time, props: ElementPropSingle | IToOptions): this
    /**
     * Tween the object target(s) for the specified time from the last frame
     */
    to<T extends {}>(target: OneOrMany<T>, to: Time, props: Partial<T> | IToOptions): this
    /**
     * Tween the Node/Element target(s) using the specified keyframes from the last frame
     */
    keyframesTo(target: OneOrMany<Node | string>, to: Time, props: ElementPropMany | IToOptions): this
    /**
     * Tween the Object target(s) using the specified keyframes from the last frame
     */
    keyframesTo<T extends {}>(target: OneOrMany<T>, to: Time, props: Keyframes<T> | IToOptions): this

    /*// TIMELINE CONTROLS */
    /**
     * Reverse the direction of the timeline (this.playbackRate *= -1)
     */
    reverse(): this
    /**
     * Seek to the specified time or label.
     * - If the time occurs before or after the timeline, it will be clamped
     * - If the label does not exist, it will throw an error
     * - If the timeline is not active, it will activate and move to a paused state
     */
    seek(time: Time): this
    /**
     * Play the timeline and activate all sub-timelines.  The 'play' event will be fired if the timeline is in an idle or paused state
     * - If the timeline is not active, it will activate and move to a running state
     * - If the timeline is already in a running state, it will be ignored
     * - If the from/to are specified, the currentTime will seek to those boundaries
     * - If the from/to are specified, the internal duration of the timeline will be the difference
     */
    play(options?: IPlayOptions): this
    /**
     * Shortcut function for .cancel() + .play()
     */
    restart(): this
    /**
     * Cancels the timeline and removes all removable effects.  The 'cancel' event will be called
     * - currentTime will be set to undefined
     * - playbackRate will be reset to 1
     * - all sub-timelines will be canceled
     */
    cancel(): this
    /**
     * Finish the timeline.  This promotes currentTime to the duration or 0 depending on
     * the playbackRate, alternate, and repeat.  The timeline remains active and so do all effects.
     * Calls the 'finish' event
     */
    finish(): this

    /*// EVENT HANDLING */
    /**
     * Subscribe function to timeline events
     */
    on(key: TimelineEvent, callback: () => any): void
    /**
     * Unsubscribe function from timeline events
     */
    off(key: TimelineEvent, callback: () => any): void
    /**
     * Get a promise the next time the timeline event occurs.  Useful for await/async style code
     * or chaining promises
     */
    when(key: TimelineEvent): Promise<void>
}
