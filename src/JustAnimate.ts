import {each} from './common/lists';
import {Animator} from './plugins/core/Animator';
import {TimeLoop, ITimeLoop} from './plugins/core/TimeLoop';
import {MixinService} from './plugins/core/MixinService';

export class JustAnimate {
    public plugins: ja.IPlugin[];

    private _resolver: MixinService;
    private _timeLoop: ITimeLoop;

    public static inject(animations: ja.IAnimationMixin[]): void {
        const resolver = new MixinService();
        each(animations, (a: ja.IAnimationMixin) => resolver.registerAnimation(a, true));
    }

    constructor() {
        const self = this;
        self._resolver = new MixinService();
        self._timeLoop = TimeLoop();
        self.plugins = [];
    }
    public animate(options: ja.IAnimationOptions | ja.IAnimationOptions[]): ja.IAnimator {
        return new Animator(this._resolver, this._timeLoop, this.plugins).animate(options);
    }
    public register(preset: ja.IAnimationMixin): void {
        this._resolver.registerAnimation(preset, false);
    }
    public inject(animations: ja.IAnimationMixin[]): void {
        const resolver = this._resolver;
        each(animations, (a: ja.IAnimationMixin) => resolver.registerAnimation(a, true));
    }
}
