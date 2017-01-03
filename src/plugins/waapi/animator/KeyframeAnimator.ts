import * as waapi from '../waapi';

export const keyframeAnimator = (initializer: { (): waapi.Animation; }): ja.IAnimationController => {
    let _initialized: boolean | undefined = undefined;
    let _init: typeof initializer | undefined = initializer;
    let _animator: waapi.Animation;

    const ensureInit = (): void => {
        if (_init) {
            _initialized = false;
            _animator = _init();
            _init = undefined;
            _initialized = true;
        }
    };

    const self = {
        totalDuration: 0,
        seek(value: number): void {
            ensureInit();
            if (_animator.currentTime !== value) {
                _animator.currentTime = value;
            }
        },
        playbackRate(value: number): void {
            ensureInit();
            if (_animator.playbackRate !== value) {
                _animator.playbackRate = value;
            }
        },
        reverse(): void {
            ensureInit();
            _animator.playbackRate *= -1;
        },
        restart(): void {
            const animator = _animator;
            animator.cancel();
            animator.play();
        },
        playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | undefined {
            ensureInit();

            const animator = _animator;
            const playState = !animator || _initialized === false ? 'fatal' : animator.playState;
            if (value === undefined) {
                return playState as ja.AnimationPlaybackState;
            }

            if (playState === value) {
                /* do nothing */
            } else if (playState === 'fatal') {
                animator.cancel();
            } else if (value === 'finished') {
                animator.finish();
            } else if (value === 'idle') {
                animator.cancel();
            } else if (value === 'paused') {
                animator.pause();
            } else if (value === 'running') {
                animator.play();
            }
            return undefined;
        }
    };

    return self;
};
