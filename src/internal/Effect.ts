import { IEffectKeyframe } from '../types/effect'
import { IMixerTweenFunction } from '../types'
import { _ } from './constants'
import { isDefined } from './inspect' 

export interface IEffectOptions {
    $: {}
    k: IEffectKeyframe[]
    m: IMixerTweenFunction
}

export interface IEffect {
    update(time: number): void
    cancel(): void
}

export interface IEffectPrivate extends IEffect {
    /**
     * initial value
     */
    i: any
    /**
     * setter
     */
    s: (target: {}, key: string, v: any) => void
    /**
     * getter
     */
    g: (target: {}, key: string) => any
    /**
     * target
     */
    $: {}
    /**
     * property
     */
    p: string
    /**
     * keyframes
     */
    k: IEffectKeyframe[]
    /**
     * mixer
     */
    m: IMixerTweenFunction
    /**
     * rate
     */
    r: number
    /**
     * time
     */
    t: number 
}

export function effect(options: IEffectOptions): IEffect {
    const self = Object.create(effect.prototype) as IEffectPrivate
    self.$ = options.$
    self.k = options.k.sort(byTime) 
    self.m = options.m
    return self
}

function byTime(a: IEffectKeyframe, b: IEffectKeyframe) {
    return b.t - a.t
}

effect.prototype = {
    cancel(this: IEffectPrivate) {
        const self = this
        // reset value to initial
        if (isDefined(self.i)) {
            self.s(self.$, self.p, self.i)
            self.i = _
        }
    },
    update(this: IEffectPrivate, time: number) {
        const self = this
        const k = self.k
        if (!isDefined(self.i)) {
            self.i = self.g(self.$, self.p)
        }
        self.t = time
        let toIndex = findToFrame(self)
        if (!toIndex) {
            toIndex = 1
        }
        
        const fromIndex = toIndex - 1
        const fromFrame = k[fromIndex]
        const toFrame = k[toIndex]
        const mixer = self.m(fromFrame.v, toFrame.v)
        const offset = findMid(fromFrame.t - (toFrame.d || 0), toFrame.t, time)
        const v = mixer(toFrame.e ? toFrame.e(offset) : offset)

        if (isDefined(v)) {
            // if undefined, it is assumed the value was set, otherwise use the setter function
            self.s(self.$, self.p, v)
        }
    }
}

function findMid(a: number, b: number, m: number) {
    return (m - a) / (b - a)
}

function findToFrame(self: IEffectPrivate): number {
    let t = self.t
    for (let i = self.k.length - 1; i > -1; i--) {
        const frame = self.k[i]
        if (t <= frame.t) {
            return i
        }
    }
    return 0
}
