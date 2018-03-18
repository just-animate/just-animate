import { copyExclude, keys}  from '../core/utils';
import { use } from '../core/middleware';
 
const RUNNING = 'running';

// minimum amount of time left on an animation required to call .play()
const frameSize = 17;

use(effect => {
    const target = effect.target as Element;
    if (!(target instanceof Element)) {
        return undefined;
    }

    const duration = effect.duration || 1;
    return keys(effect.props).map(propertyName => {
        const config = effect.props[propertyName];
        const times = keys(config)
            .map(c => +c)
            .filter(c => isFinite(c) && c >= 0 && c <= duration)
            .sort();

        // create keyframes
        let hasStart: boolean, hasEnd: boolean;
        const keyframes: waapi.IKeyframe[] = [];
        for (let i = 0, tLen = times.length; i < tLen; i++) {
            const time = times[i];
            const timeConfig = config[time] as ja.IValueJSON;

            const offset = time / duration;
            if (offset === 0) {
                hasStart = true;
            }
            if (offset === 1) {
                hasEnd = true;
            }

            if (timeConfig.type === 'set') {
                // if it is a set type, add a keyframe right before it with step-start easing
                const lastIndex = i - 1;
                const lastFrame =
                    lastIndex > -1 && (config[times[lastIndex]] as ja.IValueJSON);
                if (lastFrame) {
                    keyframes.push({
                        offset: offset - 0.0000001,
                        easing: 'step-start',
                        [propertyName]: lastFrame.value
                    });
                }
            }

            // find the next frame and pull the easing from it.  
            // in JA3, it uses the "destination" frame for tween settings. WAAPI uses the source frame
            const nextIndex = i + 1;
            const nextFrame =
                nextIndex < tLen && (config[times[nextIndex]] as ja.IValueJSON);
            // grab the easing from next value
            const easing = (nextFrame && nextFrame.easing) || 'linear';

            keyframes.push({
                offset: offset,
                easing: easing,
                [propertyName]: timeConfig.value
            });
        }

        if (!hasStart) {
            // ensure first frame
            const lastKeyframe = copyExclude(keyframes[0]);
            lastKeyframe.offset = 0;
            keyframes.push(lastKeyframe);
        }
        if (!hasEnd) {
            // ensure last frame
            const lastKeyframe = copyExclude(keyframes[keyframes.length - 1]);
            lastKeyframe.offset = 1;
            keyframes.push(lastKeyframe);
        }

        let animator: waapi.IWebAnimation;
        return {
            props: [propertyName],
            created() {
                animator = target.animate(keyframes, {
                    duration: effect.duration,
                    fill: 'both'
                });
                animator.pause();
            },
            updated(ctx: ja.IAnimationUpdateContext) {
                const time = ctx.time;
                const rate = ctx.rate;
                const isPlaying = ctx.state === RUNNING;

                if (Math.abs(animator.currentTime - time) > 1) {
                    // re-sync if timeline and WAAPI are out of sync
                    animator.currentTime = time;
                }

                if (isPlaying && animator.playbackRate !== rate) {
                    // if current time is too close to the end, move it by 1 ms to prevent flickering
                    // this is a fix for FireFox
                    const currentTime = animator.currentTime;
                    if (currentTime < 1) {
                        animator.currentTime = 1;
                    } else if (currentTime >= effect.duration - 1) {
                        animator.currentTime = effect.duration - 1;
                    }

                    // set playbackRate direction/speed
                    animator.playbackRate = rate;
                }

                const needsToPlay =
                    isPlaying &&
                    !(
                        animator.playState === RUNNING ||
                        animator.playState === 'finished'
                    ) &&
                    !(rate < 0 && time < frameSize) &&
                    !(rate >= 0 && time > effect.duration - frameSize);

                if (needsToPlay) {
                    animator.play();
                }

                const needsToPause =
                    !isPlaying &&
                    (animator.playState === RUNNING ||
                        animator.playState === 'pending');
                if (needsToPause) {
                    animator.pause();
                }
            },
            destroyed() {
                animator.cancel();
            }
        };
    });
});
