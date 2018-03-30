declare global {
    export const JA: types.JustAnimateStatic; 

    export interface Window {
        JA: types.JustAnimateStatic;
    }
    export interface Element {
        animate: waapi.IElementAnimate;
    }
}

export namespace types {
    export interface JustAnimateStatic {}

    export interface IObservable<T> {
        next(n: T): void;
        subscribe(fn: IObserver<T>): ISubscription;
    }

    export interface ISubcribable<T> {
        subscribe(fn: IObserver<T>): ISubscription;
    };

    export interface IObserver<T> {
        (value: T): void;
    }

    export type ObservableProxy<T> = Record<string, T> & types.ISubcribable<string[]>;

    export interface IProxyHandler<T> {
        get?: <P extends keyof T>(target: T, prop: P) => T[P];
        set?: <P extends keyof T>(
            target: T,
            prop: P,
            value: T[P],
            receiver: any
        ) => boolean;
        deleteProperty?: <P extends keyof T>(target: T, prop: P) => boolean;
    }

    export interface ISubscription {
        unsubscribe(): void;
    }

    export interface IMiddleware {
        (config: IEffect): IAnimation[];
    }

    export interface IEffect {
        target: {};
        duration: number;
        props: Record<string, ITimeJSON>;
    }

    export interface IAnimation {
        target?: string;
        props?: string[];
        created(): void;
        updated(options: IAnimationUpdateContext): void;
        destroyed(): void;
    }

    export interface IAnimationUpdateContext {
        rate: number;
        time: number;
        state: PlaybackState;
    }

    export type PlaybackState = 'idle' | 'paused' | 'running';

    export interface ITimelineState {
        time: number;
        rate: number;
        state: PlaybackState;
        alternate: boolean;
        repeat: number;
    }

    export interface ITimelineOptions {
        /**
         * The name of the timeline.  Providing a name adds this to the global list of timelines.
         * Each timeline should be named something unique.
         */
        name?: string;
        labels?: Record<string, number>;
        refs?: Record<string, {}>;
    }

    export interface ITimelineJSON {
        timing: ITimingJSON;
        /**
         * Targets
         */
        targets: ITargetJSON;
        /**
         * Labels
         */
        labels: Record<string, number>;
    }

    export interface ITimingJSON {
        duration: number;
    }

    export interface ITargetJSON {
        [selector: string]: IPropertyJSON;
    }

    export interface IPropertyJSON {
        [property: string]: ITimeJSON;
    }

    export interface ITimeJSON {
        $enabled?: boolean;
        [time: string]: IValueJSON | boolean;
    }

    export interface IValueJSON {
        value: any;
        type?: 'tween' | 'set';
        easing?: string;
        limit?: number;
        staggerStart?: number;
        staggerEnd?: number;
    }

    export type ChangeSetOrCode = ChangeSet | number | undefined;

    export type ChangeSet = Record<string, number>;
}

export namespace waapi {
    export type PlayState =
        | 'idle'
        | 'running'
        | 'paused'
        | 'finished'
        | 'pending';

    export interface IElementAnimate {
        (keyframes: IKeyframe[], duration: number): IWebAnimation;
        (keyframes: IKeyframe[], timing: IEffectTiming): IWebAnimation;
        (
            keyframes: IKeyframe[],
            timingOrDuration: IEffectTiming | number
        ): IWebAnimation;
    }

    export interface IWebAnimation {
        id: string;
        currentTime: number;
        playState: PlayState;
        playbackRate: number;
        pending: boolean;

        oncancel?: Function;
        onfinish?: Function;

        cancel(): void;
        finish(): void;
        play(): void;
        pause(): void;
        reverse(): void;
    }

    export interface IEffectTiming {
        direction?: string;
        delay?: number;
        duration?: number;
        easing?: string;
        endDelay?: number;
        fill?: string;
        iterationStart?: number;
        iterations?: number;
    }

    export interface IKeyframe {
        offset?: number;
        easing?: string;
        [val: string]: any;
    }

    export interface ICSSKeyframe {
        'animation-timing-function'?: string;
        [val: string]: string;
    }

    export interface ICSSKeyframes {
        [offset: number]: ICSSKeyframe;
    }
}
