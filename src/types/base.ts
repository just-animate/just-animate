import { REMOVE, ADD, REPLACE } from '../_constants';

export interface IMiddleware {
    (config: IEffect): IAnimation[];
}

export interface IEffect {
    target: {}
    duration: number;
    props: Record<string, ITimeJSON>
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

export type Dict<T> = {
    keys(): string[];
    set(key: string, value: T): void;
    get(key: string): T; 
}

export interface ITimeline {
    /**
     * Containing element.  Used to narrow CSS selectors to a particular part of the document
     */
    el: Element
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

export type PlaybackState = 'idle' | 'paused' | 'running';

export interface ITimelineState {
    time: number
    rate: number
    state: PlaybackState
    alternate: boolean
    repeat: number
} 

export interface ITimelineOptions {
    /**
     * The name of the timeline.  Providing a name adds this to the global list of timelines.  
     * Each timeline should be named something unique.
     */
    name?: string;
}

export interface ITimelineJSON {
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

export type ChangeSetOrCode =
    | ChangeSet
    | typeof REMOVE
    | typeof ADD
    | typeof REPLACE
    | undefined;

export type ChangeSet = Record<string, typeof REMOVE | typeof ADD | typeof REPLACE>;
