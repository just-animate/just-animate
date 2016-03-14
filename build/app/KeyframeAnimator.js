var helpers_1 = require('./helpers');
var KeyframeAnimator = (function () {
    function KeyframeAnimator(animations) {
        if (!helpers_1.isArray(animations)) {
            throw Error('AnimationRelay requires an array of animations');
        }
        this._animations = animations;
    }
    KeyframeAnimator.prototype.finish = function (fn) {
        helpers_1.multiapply(this._animations, 'finish', [], fn);
        return this;
    };
    KeyframeAnimator.prototype.play = function (fn) {
        helpers_1.multiapply(this._animations, 'play', [], fn);
        return this;
    };
    KeyframeAnimator.prototype.pause = function (fn) {
        helpers_1.multiapply(this._animations, 'pause', [], fn);
        return this;
    };
    KeyframeAnimator.prototype.reverse = function (fn) {
        helpers_1.multiapply(this._animations, 'reverse', [], fn);
        return this;
    };
    KeyframeAnimator.prototype.cancel = function (fn) {
        helpers_1.multiapply(this._animations, 'cancel', [], fn);
        return this;
    };
    Object.defineProperty(KeyframeAnimator.prototype, "onfinish", {
        get: function () {
            if (this._animations.length === 0) {
                return undefined;
            }
            return this._animations[0].onfinish || helpers_1.noop;
        },
        set: function (val) {
            helpers_1.each(this._animations, function (a) { a.onfinish = val; });
        },
        enumerable: true,
        configurable: true
    });
    return KeyframeAnimator;
})();
exports.KeyframeAnimator = KeyframeAnimator;
