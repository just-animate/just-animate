import {IAnimationSheetEvent} from './IAnimationSheetEvent';

export interface IAnimationSheetOptions {
    events: IAnimationSheetEvent[];
    duration: number;
    autoplay?: boolean;
}