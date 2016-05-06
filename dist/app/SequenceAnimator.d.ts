export declare class SequenceAnimator implements ja.IAnimator {
    playbackRate: number;
    onfinish: ja.IConsumer<ja.IAnimator>;
    oncancel: ja.IConsumer<ja.IAnimator>;
    private _currentIndex;
    private _errorCallback;
    private _manager;
    private _steps;
    currentTime: number;
    duration: number;
    constructor(manager: ja.IAnimationManager, options: ja.ISequenceOptions);
    finish(fn?: ja.ICallbackHandler): ja.IAnimator;
    play(fn?: ja.ICallbackHandler): ja.IAnimator;
    pause(fn?: ja.ICallbackHandler): ja.IAnimator;
    reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
    cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
    private _isInEffect();
    private _getAnimator();
    private _playNextStep(evt);
    private _playThisStep();
}
