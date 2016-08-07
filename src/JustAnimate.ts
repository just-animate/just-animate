import {each} from './helpers/lists';
import {Animator} from './core/Animator';
import {TimeLoop, ITimeLoop} from './core/TimeLoop';
import {nothing} from './helpers/resources';
import {AnimationResolver} from './core/AnimationResolver';

export function JustAnimate(): ja.IJustAnimate {
    let self = this;
    self = self instanceof JustAnimate ? self : Object.create(JustAnimate.prototype);
    self._registry = {};
    self._resolver = AnimationResolver();
    self._timeLoop = TimeLoop();
    return self;
}

(JustAnimate as any).inject = inject;

JustAnimate.prototype = {
    _resolver: nothing as ja.IAnimationResolver,
    _timeLoop: nothing as ITimeLoop,
    
    animate(options: ja.IAnimationOptions | ja.IAnimationOptions[]): ja.IAnimator {
        const animator = Animator(this._resolver, this._timeLoop);        
        animator.animate(options);
        return animator;
    },
    register(preset: ja.IAnimationPreset): void {
        this._resolver.registerAnimation(preset, false);
    },
    inject: inject
};

function inject(animations: ja.IAnimationPreset[]): void {
    const resolver = AnimationResolver();
    each(animations, (a: ja.IAnimationPreset) => resolver.registerAnimation(a, true));
}
