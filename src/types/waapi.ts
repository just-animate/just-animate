
export type PlayState = 'idle' | 'running' | 'paused' | 'finished' | 'pending'

declare global {
    // tslint:disable-next-line:interface-name
    interface Element {
        animate: IElementAnimate
    }
}

export interface IElementAnimate {
    (keyframes: IKeyframe[], duration: number): IWebAnimation
    (keyframes: IKeyframe[], timing: IEffectTiming): IWebAnimation
    (keyframes: IKeyframe[], timingOrDuration: IEffectTiming | number): IWebAnimation
}

export interface IWebAnimation {
    id: string
    currentTime: number
    playState: PlayState
    playbackRate: number
    pending: boolean

    oncancel?: Function
    onfinish?: Function

    cancel(): void
    finish(): void
    play(): void
    pause(): void
    reverse(): void
}

export interface IEffectTiming {
    direction?: string
    delay?: number
    duration?: number
    easing?: string
    endDelay?: number
    fill?: string
    iterationStart?: number
    iterations?: number
}

export interface IKeyframe {
    offset?: number
    easing?: string
    [val: string]: any
}

export interface ICSSKeyframe {
    'animation-timing-function'?: string
    [val: string]: string
}

export interface ICSSKeyframes {
    [offset: number]: ICSSKeyframe
}
