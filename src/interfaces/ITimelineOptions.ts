import {ITimelineEvent} from './ITimelineEvent';

export interface ITimelineOptions {
    events: ITimelineEvent[];
    duration: number;
    autoplay?: boolean;
}