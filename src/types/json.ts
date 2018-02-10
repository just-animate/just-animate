/**
 * This file describes JSON data-structures.  They are intended to be as small as possible
 */

export interface ITimelineJSON {
    /**
     * Targets
     */
    $: ITargetJSON[]
    /**
     * Labels
     */
    L: Record<string, number>
}

export interface ITargetJSON {
    /**
     * Targeted elements (refs or selectors)
     */
    $: string
    /**
     * property key
     */
    k: string
    /**
     * Target keyframes
     */
    f: IValueJSON[]
}
export interface IValueJSON {
    /**
     * Time
     */
    t: number
    /**
     * Easing
     */
    e: string
    /**
     * Category of value:
     *  - S: stagger to
     *  - I: immediate (set)
     *  - T: tween to
     */
    c: 'S' | 'I' | 'T'
    /**
     * Value
     */
    v: string | number
    /**
     * Stagger Limit
     */
    l?: number
    /**
     * Delay
     */
    d?: number
}
  
export interface IFrameKeyframeJSON {
    /**
     * value at this offset
     */
    v: string | number
    /**
     * offset
     */
    o: number
    /**
     * easing function for this keyframe
     */
    e: string
}
