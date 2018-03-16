import {
    IPlayOptions,
    IToOptions,
    Time,
    OneOrMany,
    IAction,
    ITimelineOptions
} from '../types';
import { ITargetJSON, ITimeJSON, ITimelineJSON } from '../types/json';
import { globals } from './globals';
import { clone, addOrGet } from './objects';
import { list, remove } from './arrays';
import { isString, isDefined } from './inspect';
import { _ } from './constants';

export type KeyframeType = 'tween' | 'set';
export type PlaybackState = 'idle' | 'paused' | 'running';

export function timeline(options: ITimelineOptions) {
    return new Timeline(options);
}

export class Timeline {
    public labels: Record<string, number>;
    public targets: ITargetJSON;
    public events: Record<string, (() => void)[]>;
    public start: number;

    private _state: PlaybackState;
    private _time: number;
    private _rate: number;
    private _duration: number;

    public get duration(): number {
        return Math.max(calculateDuration(this), this._duration);
    }
    public set duration(value: number) {
        this._duration = value;
    }
    public get currentTime(): number {
        return this._time;
    }
    public set currentTime(value: number) {
        const self = this;
        self._time = value;
        // todo: update
    }
    public get playbackRate(): number {
        return this._rate;
    }
    public set playbackRate(value: number) {
        const self = this;
        self._rate = value;
        // todo: update
    }
    public get playbackState(): PlaybackState {
        return this._state;
    }
    public set playbackState(value: PlaybackState) {
        const self = this;
        self._state = value;
        // todo: update
    }
    constructor(options: ITimelineOptions) {
        const self = this;
        // add handlers for this dispatcher
        self._state = 'idle';
        self._rate = 1;
        self.start = 0;
        self.events = {};
        self.targets = {};
        self.labels = clone(globals.labels, options.labels);
    }

    public set(
        target: OneOrMany<{} | string>,
        props: IToOptions,
        position?: number | string
    ): this {
        const self = this;
        addSingleKeyframe(self, target, 0, props, 'set', position);
        keyframesUpdated(self);
        return self;
    }
    public to(
        target: OneOrMany<{} | string>,
        duration: number,
        props: IToOptions,
        position?: number | string
    ): this {
        const self = this;
        addSingleKeyframe(this, target, duration, props, 'tween', position);
        keyframesUpdated(self);
        return self;
    }
    public play(_options?: IPlayOptions): this {
        // todo: play
        return this;
    }
    public cancel(): this {
        // todo: cancel
        return this;
    }
    public finish(): this {
        // todo: finish
        return this;
    }
    public restart(): this {
        return this.cancel().play();
    }
    public reverse(): this {
        this.playbackRate *= -1;
        return this;
    }
    public seek(time: string | number): this {
        const self = this;
        const t = resolveLabel(self, time);
        isFinite(t) && (self.currentTime = t);
        return self;
    }
    public export(): ITimelineJSON {
        // do a deep clone here to prevent modifications to the export from tainting
        // change detection on re-imports.  Changing a deep property without doing this would
        // change the internal state of the timeline.
        return {
            duration: this.duration,
            targets: this.targets,
            labels: this.labels,
            player: {
                currentTime: this.currentTime,
                playbackState: this.playbackState,
                playbackRate: this.playbackRate
            }
        };
    }
    public import(json: ITimelineJSON): this {
        const self = this;
        if (isDefined(json.labels)) {
            self.labels = json.labels;
        }
        if (isDefined(json.targets)) {
            self.targets = json.targets;
        }
        if (isDefined(json.player)) {
            self.playbackRate = json.player.playbackRate;
            self.playbackState = json.player.playbackState;
            self.currentTime = json.player.currentTime;
        }
        if (isDefined(json.duration)) {
            self.duration = json.duration;
        }
        keyframesUpdated(self);
        return self;
    }
    public on(eventName: string, callback: IAction): this {
        const h = this.events;
        const hs = h[eventName] || (h[eventName] = []);
        hs.push(callback);
        return this;
    }
    public off(eventName: string, callback: IAction): this {
        const hs = this.events[eventName];
        hs && remove(hs, callback);
        return this;
    }
}

// --- PRIVATE FUNCTIONS BELOW HERE ---
function emit(self: Timeline, eventName: string): void {
    let hs = self.events[eventName];
    if (hs) {
        hs = hs.slice();
        for (let i = 0; i < hs.length; i++) {
            hs[i]();
        }
    }
}

function resolveTime(self: Timeline, at: string | number, to: number) {
    return (resolveLabel(self, at) || self.start) + to;
}

function addSingleKeyframe(
    self: Timeline,
    target: any,
    duration: number,
    props: Record<string, any> & IToOptions,
    type: KeyframeType,
    position: string | number
): number {
    // gets the target selector and replaces objects with string references
    const selectors = list(target);
    const selector = selectors.join(',');

    // resolve the actual end time on the timeline
    // labels are not preserved... something to look at on a later date
    const end = resolveTime(self, position, duration);

    const limit = props.$limit || _;
    const staggerStart = props.$staggerStart || 0;
    const startEnd = props.$startEnd || 0;

    // calculate the real end time
    // get the easing value... should be a string css easing or a reference at this point
    const easing = (props.$easing || undefined) as string;

    for (let key in props) {
        // ignore properties that start with $, those are internal
        if (key.indexOf('$') !== 0) {
            insertKeyframe(
                self,
                selector,
                key,
                end,
                props[key],
                type,
                easing,
                limit,
                staggerStart,
                startEnd
            );
        }
    }
    updatePosition(self, end);
    return end;
}

function insertKeyframe(
    self: Timeline,
    selector: string,
    key: string,
    time: number,
    nextVal: string | number,
    type: KeyframeType,
    easing?: string,
    limit?: number,
    staggerStart?: number,
    staggerEnd?: number
) {
    const target = addOrGet(self.targets, selector);
    const prop = addOrGet(target, key);
    const event = addOrGet(prop as ITimeJSON, time + '');

    // todo: change detection

    event.value = nextVal;
    event.type = type;
    easing && (event.easing = easing);
    limit && (event.limit = limit);
    staggerStart && (event.staggerStart = staggerStart);
    staggerEnd && (event.staggerEnd = staggerEnd);
}

// function resolveTargets(self: Timeline, selectorString: string): {}[] {
//     return mapFlatten(selectorString.split(','), (s: string) => {
//         const selector = s.trim();
//         return document.querySelectorAll(selector);
//     });
// }

function updatePosition(self: Timeline, end: number) {
    self.start = Math.max(self.start, end);
}

function keyframesUpdated(self: Timeline) {
    // let subscribers know the configuration has changed
    emit(self, 'config');

    if (self.playbackState !== 'idle') {
        // update effects
        return;
    }
}

function resolveLabel(self: Timeline, time: Time): number {
    return (isString(time) && self.labels[time]) || +time;
}

function calculateDuration(self: Timeline) {
    // todo: investigate a cheaper and less verbose way to do this or cache
    let duration = 0;
    const targets = self.targets;
    for (let selector in targets) {
        const props = targets[selector];
        for (let time in props) {
            if (duration < +time) {
                duration = +time;
            }
        }
    }
    return duration;
}
