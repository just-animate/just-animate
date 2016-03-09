var helpers_1 = require('./helpers');
var AnimationRelay = (function () {
    function AnimationRelay(animations) {
        if (!helpers_1.isArray(animations)) {
            throw Error('AnimationRelay requires an array of animations');
        }
        this._animations = animations;
    }
    AnimationRelay.prototype.finish = function (fn) {
        helpers_1.multiapply(this._animations, 'finish', [], fn);
        return this;
    };
    AnimationRelay.prototype.play = function (fn) {
        helpers_1.multiapply(this._animations, 'play', [], fn);
        return this;
    };
    AnimationRelay.prototype.pause = function (fn) {
        helpers_1.multiapply(this._animations, 'pause', [], fn);
        return this;
    };
    AnimationRelay.prototype.reverse = function (fn) {
        helpers_1.multiapply(this._animations, 'reverse', [], fn);
        return this;
    };
    AnimationRelay.prototype.cancel = function (fn) {
        helpers_1.multiapply(this._animations, 'cancel', [], fn);
        return this;
    };
    Object.defineProperty(AnimationRelay.prototype, "onfinish", {
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
    return AnimationRelay;
})();
exports.AnimationRelay = AnimationRelay;
