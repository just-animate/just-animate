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
import { ITimelineJSON, ITargetJSON, ITargetDirty } from '../types/json'
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
     * Use waapi handlers
     */
    _waapi: boolean
    /**
     * Current position to insert new .to keyframes
     */
    _pos: number
    /**
     * current internal time
     */
    _time: number
    /**
     * List of differences between last keyframes and current keyframes
     */
    _kdiff: ITargetDirty
}

export function timeline(options?: ITimelineOptions): ITimeline {
    const self = Object.create(timeline.prototype) as ITimelinePrivate
    // add handlers for this dispatcher
    self.playState = 'idle'
    self.playbackRate = 1
    self.duration = 0
    self._pos = 0
    self.E = {}
    self.$ = {}
    // figure out if WAAPI should be used as the default mixer for Element Styles
    self._waapi = isDefined(options.useWAAPI) ? options.useWAAPI : globals.useWAAPI
    // import mixers with options preferred over globals
    self.mixers = clone(globals.mixers, options.mixers)
    self.refs = clone(globals.refs, options.refs)
    self.labels = clone(globals.labels, options.labels)

    return self
}

const proto = {
    get duration(this: ITimelinePrivate) {
        // note: it might be a good idea to cache this.  I don't want to optimize too early though
        return calculateDuration(this)
    },
    get currentTime(this: ITimelinePrivate): number {
        return this._time
    },
    set currentTime(this: ITimelinePrivate, value: number) {
        const self = this
        self._time = value
        // todo: update
    },
    addSequence(this: ITimelinePrivate, _animations: ITargetOptions[], _at?: string | number): ITimeline {
        // todo: sequence
        return this
    },
    addMultiple(this: ITimelinePrivate, _animations: ITargetOptions[], at?: string | number): ITimeline {
        const self = this
        for (let i = 0; i < _animations.length; i++) {
            const a = _animations[i]
            a.$at = at
            addSingleKeyframe(self, a.$target, a.$duration, a, 'T', true)
        }
        // updatePosition(self, end)
        updateEffects(self)
        // todo: multiple
        return this
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
        props.$at = at
        return addSingleKeyframe(this, target, 0, props, 'I')
    },
    staggerTo(this: ITimelinePrivate, target: OneOrMany<{} | string>, duration: number, props: IToOptions): ITimeline {
        return addSingleKeyframe(this, target, duration, props, 'S')
    },
    to(this: ITimelinePrivate, target: OneOrMany<{} | string>, duration: number, props: IToOptions): ITimeline {
        return addSingleKeyframe(this, target, duration, props, 'T')
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

        if (self.playState === 'idle') {
            // todo: change detection before setting the new model
        }

        json.$ && (self.$ = json.$)
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
// function emit(self: ITimelinePrivate, eventName: string): void {
//     let hs = self.E[eventName]
//     if (hs) {
//         hs = hs.slice()
//         for (let i = 0; i < hs.length; i++) {
//             hs[i]()
//         }
//     }
// }

function resolveTime(self: ITimelinePrivate, at: string | number, to: number) {
    return (resolveLabel(self, at) || self._pos) + to
}

function addSingleKeyframe(
    self: ITimelinePrivate,
    target: any,
    duration: number,
    props: Record<string, any> & IToOptions,
    type: 'S' | 'I' | 'T',
    isBatch?: boolean
) {
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

    if (!isBatch) {
        updatePosition(self, end)
        updateEffects(self)
    } 
    return self
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

    // flag as changed if the animation is active and the property or option changed
    // prettier-ignore
    const isDirty = self.playState !== 'idle' && (
        event.v !== nextVal
        || event.c !== type
        || event.d !== delay
        || event.l !== limit
    )
    if (isDirty) {
        addOrGet(addOrGet(self._kdiff, selector), key)[time] = 1
    }

    event.v = nextVal
    event.c = type
    easing && (event.e = easing)
    delay && (event.d = delay)
    limit && (event.l = limit)
}

function updatePosition(self: ITimelinePrivate, end: number) {
    self._pos = Math.max(self._pos, end)
}

function updateEffects(self: ITimelinePrivate) {
    if (self.playState === 'idle') {
        // ignore update effects if timeline is not active
        return
    }

    // todo: update effects based on dirty property

    // remove list of dirty effects
    self._kdiff = {}
}

function resolveLabel(self: ITimelinePrivate, time: Time): number {
    return (isString(time) && self.labels[time]) || +time
}

function calculateDuration(self: ITimelinePrivate) {
    // todo: investigate a cheaper and less verbose way to do this
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
