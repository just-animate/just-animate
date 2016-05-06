export declare class ElementAnimator implements ja.IAnimator {
    duration: number;
    onfinish: ja.IConsumer<ja.IAnimator>;
    oncancel: ja.IConsumer<ja.IAnimator>;
    private _animators;
    playbackRate: number;
    constructor(manager: ja.IAnimationManager, keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming);
    currentTime: number;
    finish(fn?: ja.ICallbackHandler): ja.IAnimator;
    play(fn?: ja.ICallbackHandler): ja.IAnimator;
    pause(fn?: ja.ICallbackHandler): ja.IAnimator;
    reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
    cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
}
