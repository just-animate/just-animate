/**
 * This file describes JSON data-structures.  They are intended to be as small as possible
 */

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

    player?: {
        currentTime: number;
        playbackState: 'idle' | 'paused' | 'running';
        playbackRate: number;
    };
}

export interface ITargetJSON {
    [selector: string]: IPropertyJSON;
}

export interface IPropertyJSON {
    $enabled?: boolean;
    [property: string]: ITimeJSON | boolean;
}

export interface ITimeJSON {
    [time: string]: IValueJSON;
}

export interface IValueJSON {
    value: any;
    type?: 'tween' | 'set';
    easing?: string;
    limit?: number;
    staggerStart?: number;
    staggerEnd?: number;
}
