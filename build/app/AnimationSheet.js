var AnimationSheet = (function () {
    function AnimationSheet(options) {
        this._options = options;
    }
    AnimationSheet.prototype.finish = function (fn) {
        return this;
    };
    AnimationSheet.prototype.play = function (fn) {
        return this;
    };
    AnimationSheet.prototype.pause = function (fn) {
        return this;
    };
    AnimationSheet.prototype.reverse = function (fn) {
        return this;
    };
    AnimationSheet.prototype.cancel = function (fn) {
        return this;
    };
    return AnimationSheet;
})();
exports.AnimationSheet = AnimationSheet;
