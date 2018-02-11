/**
 * This file describes JSON data-structures.  They are intended to be as small as possible
 */

export interface ITimelineJSON {
    /**
     * Targets
     */
    $: ITargetJSON
    /**
     * Labels
     */
    L: Record<string, number>
}

export interface ITargetJSON {
    [selector: string]: IPropertyJSON
}

export interface IPropertyJSON {
    [property: string]: ITimeJSON
}

export interface ITimeJSON {
    [time: string]: IValueJSON
}
 
export interface IValueJSON {
    /**
     * Value
     */
    v: string | number
    /**
     * Category of value:
     *  - S: stagger to
     *  - I: immediate (set)
     *  - T: tween to
     */
    c?: 'S' | 'I' | 'T'
    /**
     * Easing
     */
    e?: string
    /**
     * Stagger Limit
     */
    l?: number
    /**
     * Delay
     */
    d?: number
}
