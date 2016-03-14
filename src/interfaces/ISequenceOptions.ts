import {ISequenceEvent} from './ISequenceEvent';

export interface ISequenceOptions {
    steps: ISequenceEvent[];
    autoplay?: boolean;
}