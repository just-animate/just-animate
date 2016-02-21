'use strict';
var Just;
(function () {
    function extend(target) {
        for (var i = 1, len = arguments.length; i < len; i++) {
            var source = arguments[i];
            for (var propName in source) {
                if (source.hasOwnProperty(propName)) {
                    target[propName] = source[propName];
                }
            }
            return source;
        }
    }
    
    function AnimationManager() {
        this._definitions = {};
        this._timings = {
            "duration": 1000,
            "fill": "both"
        };
    }

    AnimationManager.prototype = {
        animate: function (name, el, timings) {
            //var promise = Promise();
            
            if (typeof name === 'undefined') {
                //promise.reject("Just.animate() requires an animation name as the first argument")
                return //promise;
            }

            var definition = this._definitions[name];
            if (typeof definition === 'undefined') {
                //promise.reject("animation \"" + name + "\" was not found")
                return //promise;
            }

            var timings2 = timings || definition.timings || {};
            var keyframes = definition.keyframes;
            
            var player = el.animate(keyframes, timings2)
            
            player.onfinish = function() {
                //promise.resolve();
            };
            
            return //promise;
        },
        configure: function (timings) {
            extend(this._timings, timings);
        },
        register: function (name, keyframes, timings) {
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
        }
    };

    Just = new AnimationManager();
    
    for (var animationName in allAnimations) {
        var a = allAnimations[animationName];
        Just.register(animationName, a.keyframes, a.timings)
    }
})();
