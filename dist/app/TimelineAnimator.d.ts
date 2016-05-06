export declare class TimelineAnimator implements ja.IAnimator {
    currentTime: number;
    duration: number;
    playbackRate: number;
    onfinish: ja.IConsumer<ja.IAnimator>;
    oncancel: ja.IConsumer<ja.IAnimator>;
    private _events;
    private _isInEffect;
    private _isFinished;
    private _isCanceled;
    private _isPaused;
    private _lastTick;
    private _manager;
    constructor(manager: ja.IAnimationManager, options: ja.ITimelineOptions);
    finish(fn?: ja.ICallbackHandler): ja.IAnimator;
    play(fn?: ja.ICallbackHandler): ja.IAnimator;
    pause(fn?: ja.ICallbackHandler): ja.IAnimator;
    reverse(fn?: ja.ICallbackHandler): ja.IAnimator;
    cancel(fn?: ja.ICallbackHandler): ja.IAnimator;
    private _tick();
    private _triggerFinish();
    private _triggerCancel();
    private _triggerPause();
    private _reset();
}
