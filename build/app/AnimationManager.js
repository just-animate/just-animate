var helpers_1 = require('./helpers');
var AnimationManager = (function () {
    function AnimationManager() {
        this._definitions = {};
        this._timings = {
            "duration": 1000,
            "fill": "both"
        };
    }
    AnimationManager.prototype.animate = function (name, el, timings) {
        //var promise = Promise();
        if (typeof name === 'undefined') {
            //promise.reject("Just.animate() requires an animation name as the first argument")
            return; //promise;
        }
        var definition = this._definitions[name];
        if (typeof definition === 'undefined') {
            //promise.reject("animation \"" + name + "\" was not found")
            return; //promise;
        }
        var timings2 = helpers_1.extend({}, definition.timings);
        if (timings) {
            timings2 = helpers_1.extend(timings2, timings);
        }
        var keyframes = definition.keyframes;
        var player = el['animate'](keyframes, timings2);
        player.onfinish = function () {
            //promise.resolve();
        };
        return; //promise;
    };
    AnimationManager.prototype.configure = function (timings) {
        helpers_1.extend(this._timings, timings);
    };
    AnimationManager.prototype.register = function (name, keyframes, timings) {
        var definition = {
            keyframes: keyframes,
            timings: timings
        };
        this._definitions[name] = definition;
        var self = this;
        this[name] = function (el, timings) {
            return self.animate(name, el, timings);
        };
        return this;
    };
    return AnimationManager;
})();
exports.AnimationManager = AnimationManager;
