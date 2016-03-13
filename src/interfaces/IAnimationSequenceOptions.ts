import {IAnimationSequenceEvent} from './IAnimationSequenceEvent';

export interface IAnimationSequenceOptions {
    steps: IAnimationSequenceEvent[];
    autoplay?: boolean;
}