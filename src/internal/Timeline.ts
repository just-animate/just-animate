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
import { ITimelineJSON, ITargetJSON, IValueJSON } from '../types/json'
import { globals } from './globals'
import { clone } from './objects'
import { toArray, find, push, mapFlatten } from './arrays'
import { replaceWithRefs } from './references'
import { isString, isDefined } from './inspect'
import { startsWith } from './strings'
import { _ } from './constants'

interface ITimelinePrivate extends ITimeline {
    /**
     * Event listeners
     */
    E: Record<string, IAction[]>
    /**
     * Target configuration
     */
    $: ITargetJSON[]
    /**
     * Use waapi handlers
     */
    _waapi: boolean
    _pos: number
}

export function timeline(options?: ITimelineOptions): ITimeline {
    const self = Object.create(timeline.prototype) as ITimelinePrivate
    // add handlers for this dispatcher
    self.playState = 'idle'
    self.duration = 0
    self.E = {}
    self.$ = []
    // figure out if WAAPI should be used as the default mixer for Element Styles
    self._waapi = isDefined(options.useWAAPI) ? options.useWAAPI : globals.useWAAPI
    // import mixers with options preferred over globals
    self.mixers = clone(globals.mixers, options.mixers)
    self.refs = clone(globals.refs, options.refs)
    self.labels = clone(globals.labels, options.labels)

    return self
}

const proto = {
    addSequence(this: ITimelinePrivate, _animations: ITargetOptions[], _at?: string | number): ITimeline {
        return this
    },
    addMultiple(this: ITimelinePrivate, _animations: ITargetOptions[], _at?: string | number): ITimeline {
        return this
    },
    addTimeline(this: ITimelinePrivate, _t1: ITimeline | IAnimation, _at?: string | number): ITimeline {
        return this
    },
    delay(this: ITimelinePrivate, time: number): ITimeline {
        this._pos += time
        return this
    },
    set(this: ITimelinePrivate, target: OneOrMany<{} | string>, to: Time, props: IToOptions): ITimeline {
        const self = this
        addToKeyframes(self, target, to, props, 'I')
        updatePosition(self)
        return self
    },
    staggerTo(this: ITimelinePrivate, target: OneOrMany<{} | string>, to: Time, props: IToOptions): ITimeline {
        const self = this
        addToKeyframes(self, target, to, props, 'T')
        updatePosition(self)
        return self
    },
    to(this: ITimelinePrivate, target: OneOrMany<{} | string>, to: Time, props: IToOptions): ITimeline {
        const self = this
        addToKeyframes(self, target, to, props, 'T')
        updatePosition(self)
        return self
    },
    reverse(this: ITimelinePrivate): ITimeline {
        return this
    },
    seek(this: ITimelinePrivate, _time: string | number): ITimeline {
        return this
    },
    play(this: ITimelinePrivate, _options?: IPlayOptions): ITimeline {
        return this
    },
    restart(this: ITimelinePrivate): ITimeline {
        return this
    },
    cancel(this: ITimelinePrivate): ITimeline {
        return this
    },
    finish(this: ITimelinePrivate): ITimeline {
        return this
    },
    export(this: ITimelinePrivate): ITimelineJSON {
        return {
            $: this.$,
            L: clone(this.labels)
        }
    },
    import(this: ITimelinePrivate, json: ITimelineJSON): ITimeline {
        const self = this
        json.L && (self.labels = json.L)
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
            const index = hs.indexOf(callback)
            if (index !== -1) {
                hs.splice(index, 1)
            }
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

function addToKeyframes(
    self: ITimelinePrivate,
    target: any,
    time: Time,
    props: Record<string, any> & IToOptions,
    type: 'S' | 'I' | 'T'
) {
    // gets the target selector and replaces objects with string references
    const selector = getTargetSelector(self, target)
    const delay = props.$delay || 0
    const limit = props.$limit || _
    // calculate the real end time
    const end = (resolveTime(self, props.$at) || self._pos) + resolveTime(self, time)
    // get the easing value... should be a string css easing or a reference
    const easing = (props.$easing || 'linear') as string

    for (let key in props) {
        if (!startsWith(key, '$')) {
            const targetJSON = getPropertyJSON(self.$, selector, key)
            const valueJSON = (find(targetJSON.f, val => val.t === end) || push(targetJSON.f, { t: end })) as IValueJSON
            valueJSON.e = easing
            valueJSON.v = props[key]
            valueJSON.c = type
            valueJSON.d = delay
            valueJSON.l = limit
        }
    }
}

function updatePosition(self: ITimelinePrivate) {
    self._pos = Math.max.apply(_, mapFlatten(self.$, s => s.f.map(s2 => s2.t)))
}

function resolveTime(self: ITimelinePrivate, time: Time): number {
    return (isString(time) && self.labels[time]) || +time
}

function getTargetSelector(self: ITimelinePrivate, targets: any): string {
    return (replaceWithRefs(self.refs, toArray(targets), true) as string[]).join(',')
}

function getPropertyJSON(targets: ITargetJSON[], selector: string, key: string) {
    return (
        find(targets, t => t.$ === selector && t.k === key) ||
        push(targets, {
            $: selector,
            k: key,
            f: []
        })
    )
}
