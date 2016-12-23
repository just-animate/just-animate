export type Animation = {
    id: string;
    startTime: number;
    currentTime: number;
    playState: 'idle' | 'pending' | 'running' | 'paused' | 'finished';
    playbackRate: number;
    onfinish: Function;
    oncancel: Function;

    cancel(): void;
    finish(): void;
    play(): void;
    pause(): void;
    reverse(): void;

    addEventListener(eventName: string, listener: Function): void;
    removeEventListener(eventName: string, listener: Function): void;
};

export interface IElementAnimate {
    animate(keyframes: Keyframe[], timings: EffectTiming): Animation;
}

export type EffectTiming = {
    direction?: string;
    delay?: number;
    duration?: number;
    easing?: string;
    endDelay?: number;
    fill?: string;
    iterationStart?: number;
    iterations?: number;
};

export type Keyframe = {
    offset?: number;
    easing?: string;
    transform?: string;
    [val: string]: any;
};
