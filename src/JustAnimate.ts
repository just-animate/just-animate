import { each } from './common/lists';
import { random, shuffle } from './common/random';
import { Animator } from './plugins/core/Animator';
import { TimeLoop, ITimeLoop } from './plugins/core/TimeLoop';
import { MixinService } from './plugins/core/MixinService';

export class JustAnimate {
    /**
     * List of plugins that handle new animations
     * 
     * @type {ja.IPlugin[]}
     * @memberOf JustAnimate
     */
    public plugins: ja.IPlugin[];

    /**
     * List of supported easing functions
     * 
     * @type {ja.EasingList}
     * @memberOf JustAnimate
     */    
    public easings: ja.EasingList = {
        ease: 'ease',
        easeIn: 'easeIn',
        easeInBack: 'easeInBack',
        easeInCirc: 'easeInCirc',
        easeInCubic: 'easeInCubic',
        easeInExpo: 'easeInExpo',
        easeInOut: 'easeInOut',
        easeInOutBack: 'easeInOutBack',
        easeInOutCirc: 'easeInOutCirc',
        easeInOutCubic: 'easeInOutCubic',
        easeInOutExpo: 'easeInOutExpo',
        easeInOutQuad: 'easeInOutQuad',
        easeInOutQuart: 'easeInOutQuart',
        easeInOutQuint: 'easeInOutQuint',
        easeInOutSine: 'easeInOutSine',
        easeInQuad: 'easeInQuad',
        easeInQuart: 'easeInQuart',
        easeInQuint: 'easeInQuint',
        easeInSine: 'easeInSine',
        easeOut: 'easeOut',
        easeOutBack: 'easeOutBack',
        easeOutCirc: 'easeOutCirc',
        easeOutCubic: 'easeOutCubic',
        easeOutExpo: 'easeOutExpo',
        easeOutQuad: 'easeOutQuad',
        easeOutQuart: 'easeOutQuart',
        easeOutQuint: 'easeOutQuint',
        easeOutSine: 'easeOutSine',
        elegantSlowStartEnd: 'elegantSlowStartEnd',
        linear: 'linear',
        stepEnd: 'stepEnd',
        stepStart: 'stepStart'
    };

    private _resolver: MixinService;
    private _timeLoop: ITimeLoop;

    /**
     * Register a list of mixins across all instances of JustAnimate
     * 
     * @static
     * @param {ja.IAnimationMixin[]} animations
     * 
     * @memberOf JustAnimate
     */    
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
    /**
     * Returns a new timeline of animation(s) using the options provided
     * 
     * @param {(ja.IAnimationOptions | ja.IAnimationOptions[])} options
     * @returns {ja.IAnimator}
     * 
     * @memberOf JustAnimate
     */
    public animate(options: ja.IAnimationOptions | ja.IAnimationOptions[]): ja.IAnimator {
        return new Animator(this._resolver, this._timeLoop, this.plugins).animate(options);
    }
    /**
     * Generates a random number between the first and last number (exclusive)
     * 
     * @param {number} first number; start of range
     * @param {number} last number: end of range
     * @returns {number} at or between the first number until the last number
     * 
     * @memberOf JustAnimate
     */
    public random(first: number, last: number): number {
        return random(first, last);
    }
    /**
     * Registers a mixin to this instance of JustAnimate.
     * 
     * @param {ja.IAnimationMixin} preset
     * 
     * @memberOf JustAnimate
     */
    public register(preset: ja.IAnimationMixin): void {
        this._resolver.registerAnimation(preset, false);
    }
    /**
     * Returns one of the supplied values at random
     * 
     * @template T
     * @param {T[]} choices from which to choose
     * @returns {T} a choice at random
     * 
     * @memberOf JustAnimate
     */
    public shuffle<T>(choices: T[]): T {
        return shuffle(choices);
    }
    /**
     * Registers a list of mixins across all instances of JustAnimate.  Same as register in a browser environment
     * 
     * @param {ja.IAnimationMixin[]} animations
     * 
     * @memberOf JustAnimate
     */
    public inject(animations: ja.IAnimationMixin[]): void {
        const resolver = this._resolver;
        each(animations, (a: ja.IAnimationMixin) => resolver.registerAnimation(a, true));
    }
}
