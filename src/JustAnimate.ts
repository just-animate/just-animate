import {each} from './common/lists';
import {Animator} from './plugins/core/Animator';
import {TimeLoop, ITimeLoop} from './plugins/core/TimeLoop';
import {MixinService} from './plugins/core/MixinService';

export class JustAnimate {
    private _resolver: MixinService;
    private _timeLoop: ITimeLoop;

    public static inject(animations: ja.IAnimationPreset[]): void {
        const resolver = new MixinService();
        each(animations, (a: ja.IAnimationPreset) => resolver.registerAnimation(a, true));
    }

    constructor() {
        const self = this;
        self._resolver = new MixinService();
        self._timeLoop = TimeLoop();
    }
    public animate(options: ja.IAnimationOptions | ja.IAnimationOptions[]): ja.IAnimator {
        return new Animator(this._resolver, this._timeLoop).animate(options);
    }
    public register(preset: ja.IAnimationPreset): void {
        this._resolver.registerAnimation(preset, false);
    }
    public inject(animations: ja.IAnimationPreset[]): void {
        const resolver = this._resolver;
        each(animations, (a: ja.IAnimationPreset) => resolver.registerAnimation(a, true));
    }
}
