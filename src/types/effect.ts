
export interface IEffectKeyframe {
    /**
     * Value
     */
    v: string | number 
    /**
     * current time position of this keyframe
     */
    t?: number
    /**
     * Easing
     */
    e?: (offset: number) => number 
    /**
     * Delay
     */
    d?: number
}
