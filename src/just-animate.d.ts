interface Window {
    JA: ja.JustAnimateStatic;
}
interface Element {
    animate: waapi.IElementAnimate;
}

declare namespace ja {
    /**
     * Static instance of Just Animate
     * This contains all helpers and Timeline
     */
    interface JustAnimateStatic {}

    interface IMiddleware {
        (config: IEffect): IAnimation[];
    }

    interface IEffect {
        target: {};
        duration: number;
        props: Record<string, ITimeJSON>;
    }

    interface IAnimation {
        target?: string;
        props?: string[];
        created(): void;
        updated(options: IAnimationUpdateContext): void;
        destroyed(): void;
    }

    interface IAnimationUpdateContext {
        rate: number;
        time: number;
        state: PlaybackState;
    }

    type Dict<T> = {
        keys(): string[];
        set(key: string, value: T): void;
        get(key: string): T;
    };

    interface ITimeline {
        /**
         * Containing element.  Used to narrow CSS selectors to a particular part of the document
         */
        el: Element;
        /**
         * The duration of the timeline
         */
        duration: number;
        /**
         * The current state of the timeline, DO NOT MODIFY!
         */
        state: ITimelineState;
        /**
         * The current JSON configuration of targets
         */
        targets: ITargetJSON;
        /**
         * THe list of active animations
         */
        animations: IAnimation[];
        /**
         * Event listeners  Please use on/off/emit
         */
        events: Record<string, (() => void)[]>;
        /**
         * Referenced elements/targets
         */
        refs: Dict<{}>;

        new (options?: ITimelineOptions): this;

        /**
         * Imports new keyframes into the timeline
         * @param options {ITimeline}
         */
        imports(options: Partial<ITimelineJSON>): ITimeline;
        /**
         * Exports the current configuration
         */
        exports(): ITimelineJSON;
        /**
         * Gets the current player state
         */
        getState(): ITimelineState;
        /**
         * Replaces the current player state
         * @param state {Partial<ITimelineState>}
         */
        setState(state: Partial<ITimelineState>): ITimeline;
        /**
         * Emits an event to all listeners
         * @param eventName
         */
        emit(eventName: string): ITimeline;
        /**
         * Registers a listener for a particular event
         * @param eventName {string}
         * @param listener {Function}
         */
        on(eventName: string, listener: () => void): ITimeline;
        /**
         * Un-registers a listener for a particular event
         * @param eventName {string}
         * @param listener {Function}
         */
        off(eventName: string, listener: () => void): ITimeline;
    }

    type PlaybackState = 'idle' | 'paused' | 'running';

    interface ITimelineState {
        time: number;
        rate: number;
        state: PlaybackState;
        alternate: boolean;
        repeat: number;
    }

    interface ITimelineOptions {
        /**
         * The name of the timeline.  Providing a name adds this to the global list of timelines.
         * Each timeline should be named something unique.
         */
        name?: string;
    }

    interface ITimelineJSON {
        duration: number;
        /**
         * Targets
         */
        targets: ITargetJSON;
        /**
         * Labels
         */
        labels: Record<string, number>;
    }

    interface ITargetJSON {
        [selector: string]: IPropertyJSON;
    }

    interface IPropertyJSON {
        [property: string]: ITimeJSON;
    }

    interface ITimeJSON {
        $enabled?: boolean;
        [time: string]: IValueJSON | boolean;
    }

    interface IValueJSON {
        value: any;
        type?: 'tween' | 'set';
        easing?: string;
        limit?: number;
        staggerStart?: number;
        staggerEnd?: number;
    }

    type ChangeSetOrCode = ChangeSet | number | undefined;

    type ChangeSet = Record<string, number>;
}

declare namespace waapi {
    type PlayState = 'idle' | 'running' | 'paused' | 'finished' | 'pending';

    interface IElementAnimate {
        (keyframes: IKeyframe[], duration: number): IWebAnimation;
        (keyframes: IKeyframe[], timing: IEffectTiming): IWebAnimation;
        (
            keyframes: IKeyframe[],
            timingOrDuration: IEffectTiming | number
        ): IWebAnimation;
    }

    interface IWebAnimation {
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

    interface IEffectTiming {
        direction?: string;
        delay?: number;
        duration?: number;
        easing?: string;
        endDelay?: number;
        fill?: string;
        iterationStart?: number;
        iterations?: number;
    }

    interface IKeyframe {
        offset?: number;
        easing?: string;
        [val: string]: any;
    }

    interface ICSSKeyframe {
        'animation-timing-function'?: string;
        [val: string]: string;
    }

    interface ICSSKeyframes {
        [offset: number]: ICSSKeyframe;
    }
}
