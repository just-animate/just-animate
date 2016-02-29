var helpers_1 = require('./helpers');
var AnimationRelay = (function () {
    function AnimationRelay(animations) {
        if (!helpers_1.isArray(animations)) {
            throw Error('AnimationRelay requires an array of animations');
        }
        this.animations = animations;
    }
    AnimationRelay.prototype.finish = function (fn) {
        helpers_1.multiapply(this.animations, 'finish', [], fn);
        return this;
    };
    AnimationRelay.prototype.play = function (fn) {
        helpers_1.multiapply(this.animations, 'play', [], fn);
        return this;
    };
    AnimationRelay.prototype.pause = function (fn) {
        helpers_1.multiapply(this.animations, 'pause', [], fn);
        return this;
    };
    AnimationRelay.prototype.reverse = function (fn) {
        helpers_1.multiapply(this.animations, 'reverse', [], fn);
        return this;
    };
    AnimationRelay.prototype.cancel = function (fn) {
        helpers_1.multiapply(this.animations, 'cancel', [], fn);
        return this;
    };
    Object.defineProperty(AnimationRelay.prototype, "onfinish", {
        get: function () {
            if (this.animations.length === 0) {
                return undefined;
            }
            return this.animations[0].onfinish;
        },
        set: function (val) {
            helpers_1.each(this.animations, function (a) { a.onfinish = val; });
        },
        enumerable: true,
        configurable: true
    });
    return AnimationRelay;
})();
exports.AnimationRelay = AnimationRelay;
