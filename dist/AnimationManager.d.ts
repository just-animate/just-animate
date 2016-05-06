export declare class AnimationManager implements ja.IAnimationManager {
    private _registry;
    private _timings;
    static inject(animations: ja.IAnimationOptions[]): void;
    constructor();
    animate(keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming): ja.IAnimator;
    animateSequence(options: ja.ISequenceOptions): ja.IAnimator;
    animateTimeline(options: ja.ITimelineOptions): ja.IAnimator;
    findAnimation(name: string): ja.IKeyframeOptions;
    register(animationOptions: ja.IAnimationOptions): ja.IAnimationManager;
}
