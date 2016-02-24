export interface jQuery {
    
}

export interface IElementProvider {
    (): Element| Element[] | jQuery;
}

export interface IConsumer<T1> {
    (consumable: T1): any;
}

export interface IMapper<T1, T2> {
    (mapable: T1): T2;
}

export interface IIndexed<T> {
    [index: number]: T
    length: number;
}

export interface ICallbackHandler {
    (err: any[]): void;
}    

export interface IAnimationFunction {
    (fn?: ICallbackHandler): IAnimation;
}

export interface IAnimation {
    onfinish?: Function;
    finish: IAnimationFunction;
    play: IAnimationFunction;
    pause: IAnimationFunction;
    reverse: IAnimationFunction;
    cancel: IAnimationFunction;
}

export interface IAnimationTiming {
    duration?: number;
    fill?: string;
    iterations?: number;
}

export interface IKeyframe {

}

export interface IKeyframeGroup {
    keyframes: IKeyframe[];
    timings?: IAnimationTiming;
}

export interface IKeyframeGroupDict {
    [name: string]: IKeyframeGroup
}

export interface IAnimationManager {
    animate(name: string, el: Element, timing?: IAnimationTiming);
}