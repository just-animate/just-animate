import {
    ITimeline,
    ITargetOptions,
    IPlayOptions,
    IToOptions,
    Time,
    OneOrMany,
    ITimelineOptions,
    IAction
} from '../types'
import { IAnimation } from '../waapiTypes'
import { ITimelineJSON, ITargetJSON } from '../types/json'
import { globals } from './globals'
import { clone, addOrGet, deepClone } from './objects'
import { list, remove } from './arrays'
import { replaceWithRefs } from './references'
import { isString, isDefined } from './inspect'
import { _ } from './constants'

interface ITimelinePrivate extends ITimeline {
    /**
     * Event listeners
     */
    E: Record<string, IAction[]>
    /**
     * Target configuration
     */
    $: ITargetJSON 
    /**
     * Current position to insert new .to keyframes
     */
    _pos: number
    /**
     * current internal time
     */
    _time: number
    /** 
     * current playback rate
     */
    _rate: number 
}

export function timeline(options?: ITimelineOptions): ITimeline {
    const self = Object.create(timeline.prototype) as ITimelinePrivate
    // add handlers for this dispatcher
    self.playState = 'idle' 
    self._rate = 1
    self._pos = 0
    self.E = {}
    self.$ = {} 
    // import mixers with options preferred over globals
    self.mixers = clone(globals.mixers, options.mixers)
    self.refs = clone(globals.refs, options.refs)
    self.labels = clone(globals.labels, options.labels)

    return self
}

const proto = {
    get duration(this: ITimelinePrivate) {
        // return whichever of these is the largest
        // - max keyframe time
        // - insert position (for instance, a trailing delay with no subsequent)
        // - todo: max end time of a sub-timeline.
        // note: it might be a good idea to cache the duration.  I don't want to optimize too early though
        return Math.max(calculateDuration(this), this._pos)
    },
    get currentTime(this: ITimelinePrivate): number {
        return this._time
    },
    set currentTime(this: ITimelinePrivate, value: number) {
        const self = this
        self._time = value
        // todo: update
    },
    get playbackRate(this: ITimelinePrivate): number {
        return this._rate
    },
    set playbackRate(this: ITimelinePrivate, value: number) {
        const self = this
        self._rate = value
        // todo: update
    },
    addSequence(this: ITimelinePrivate, animations: ITargetOptions[], at?: string | number): ITimeline {
        const self = this
        if (!isDefined(at)) {
            at = self._pos
        }
        for (let i = 0; i < animations.length; i++) {
            const a = animations[i]
            a.$at = at
            at = addSingleKeyframe(self, a.$target, a.$duration, a, 'T')
        }
        keyframesUpdated(self)
        return self
    },
    addMultiple(this: ITimelinePrivate, animations: ITargetOptions[], at?: string | number): ITimeline {
        const self = this
        if (!isDefined(at)) {
            at = self._pos
        }
        for (let i = 0; i < animations.length; i++) {
            const a = animations[i]
            a.$at = at
            addSingleKeyframe(self, a.$target, a.$duration, a, 'T')
        }
        keyframesUpdated(self)
        return self
    },
    addTimeline(this: ITimelinePrivate, _t1: ITimeline | IAnimation, _at?: string | number): ITimeline {
        // todo: subtimelines
        return this
    },
    addLabel(this: ITimelinePrivate, labelName: string): ITimeline {
        this.labels[labelName] = this._pos
        return this
    },
    addDelay(this: ITimelinePrivate, time: number): ITimeline {
        time > 0 && (this._pos += time)
        return this
    },
    set(this: ITimelinePrivate, target: OneOrMany<{} | string>, props: IToOptions, at?: number): ITimeline {
        const self = this
        props.$at = at
        addSingleKeyframe(self, target, 0, props, 'I')
        keyframesUpdated(self)
        return self
    },
    staggerTo(this: ITimelinePrivate, target: OneOrMany<{} | string>, duration: number, props: IToOptions): ITimeline {
        const self = this
        addSingleKeyframe(this, target, duration, props, 'S')
        keyframesUpdated(self)
        return self
    },
    to(this: ITimelinePrivate, target: OneOrMany<{} | string>, duration: number, props: IToOptions): ITimeline {
        const self = this
        addSingleKeyframe(this, target, duration, props, 'T')
        keyframesUpdated(self)
        return self
    },
    play(this: ITimelinePrivate, _options?: IPlayOptions): ITimeline {
        // todo: play
        return this
    },
    cancel(this: ITimelinePrivate): ITimeline {
        // todo: cancel
        return this
    },
    finish(this: ITimelinePrivate): ITimeline {
        // todo: finish
        return this
    },
    restart(this: ITimelinePrivate): ITimeline {
        return this.cancel().play()
    },
    reverse(this: ITimelinePrivate): ITimeline {
        this.playbackRate *= -1
        return this
    },
    seek(this: ITimelinePrivate, time: string | number): ITimeline {
        const self = this
        const t = resolveLabel(self, time)
        isFinite(t) && (self.currentTime = t)
        return self
    },
    export(this: ITimelinePrivate): ITimelineJSON {
        // do a deep clone here to prevent modifications to the export from tainting
        // change detection on re-imports.  Changing a deep property without doing this would
        // change the internal state of the timeline.
        return deepClone({
            $: this.$,
            L: this.labels
        })
    },
    import(this: ITimelinePrivate, json: ITimelineJSON): ITimeline {
        const self = this
        json.L && (self.labels = json.L)
        json.$ && (self.$ = json.$)
        keyframesUpdated(self)        
        return self
    },
    on(this: ITimelinePrivate, eventName: string, callback: IAction): ITimeline {
        const h = this.E
        const hs = h[eventName] || (h[eventName] = [])
        hs.push(callback)
        return this
    },
    off(this: ITimelinePrivate, eventName: string, callback: IAction): ITimeline {
        const hs = this.E[eventName]
        if (hs) {
            remove(hs, callback)
        }
        return this
    }
}

timeline.prototype = proto

// --- PRIVATE FUNCTIONS BELOW HERE ---
function emit(self: ITimelinePrivate, eventName: string): void {
    let hs = self.E[eventName]
    if (hs) {
        hs = hs.slice()
        for (let i = 0; i < hs.length; i++) {
            hs[i]()
        }
    }
}

function resolveTime(self: ITimelinePrivate, at: string | number, to: number) {
    return (resolveLabel(self, at) || self._pos) + to
}

function addSingleKeyframe(
    self: ITimelinePrivate,
    target: any,
    duration: number,
    props: Record<string, any> & IToOptions,
    type: 'S' | 'I' | 'T'
): number {
    // gets the target selector and replaces objects with string references
    const selectors = replaceWithRefs(self.refs, list(target), true) as string[]
    const selector = selectors.join(',')

    // resolve the actual end time on the timeline
    // labels are not preserved... something to look at on a later date
    const end = resolveTime(self, props.$at, duration)

    const delay = props.$delay || 0
    const limit = props.$limit || _

    // calculate the real end time
    // get the easing value... should be a string css easing or a reference at this point
    const easing = (props.$easing || 'linear') as string

    for (let key in props) {
        // ignore properties that start with $, those are internal
        if (key.indexOf('$') !== 0) {
            insertKeyframe(self, selector, key, end, props[key], type, easing, delay, limit)
        }
    }
    updatePosition(self, end)
    return end
}

function insertKeyframe(
    self: ITimelinePrivate,
    selector: string,
    key: string,
    time: number,
    nextVal: string | number,
    type: 'S' | 'I' | 'T',
    easing?: string,
    delay?: number,
    limit?: number
) {
    const target = addOrGet(self.$, selector)
    const prop = addOrGet(target, key)
    const event = addOrGet(prop, time + '')

    // todo: change detection

    event.v = nextVal
    event.c = type
    easing && (event.e = easing)
    delay && (event.d = delay)
    limit && (event.l = limit)
}

function updatePosition(self: ITimelinePrivate, end: number) {
    self._pos = Math.max(self._pos, end)
}

function keyframesUpdated(self: ITimelinePrivate) {
    // let subscribers know the configuration has changed
    emit(self, 'config')
    
    if (self.playState !== 'idle') {
        updateEffects(self)
        return
    }
}

function updateEffects(self: ITimelinePrivate) {
    // todo: update effects based on dirty property
}

function resolveLabel(self: ITimelinePrivate, time: Time): number {
    return (isString(time) && self.labels[time]) || +time
}

function calculateDuration(self: ITimelinePrivate) {
    // todo: investigate a cheaper and less verbose way to do this or cache
    let duration = 0
    const targets = self.$
    for (let selector in targets) {
        const props = targets[selector]
        for (let time in props) {
            if (duration < +time) {
                duration = +time
            }
        }
    }
    return duration
}
