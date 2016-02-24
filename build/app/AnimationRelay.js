var helpers_1 = require('./helpers');
var AnimationRelay = (function () {
    function AnimationRelay(animations) {
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
    return AnimationRelay;
})();
exports.AnimationRelay = AnimationRelay;
