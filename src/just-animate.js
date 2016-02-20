'use strict';
var Just;
(function () {
    function Animator() {
        this._definitions = {};
    }

    Animator.prototype = {
        animate: function (name, el, options) {
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

            var options2 = options || definition.options;
            var player = el.animate(definition.keyframes, options2);
            
            player.onfinish = function() {
                //promise.resolve();
            };
            
            return //promise;
        },
        register: function (name, keyframes, options) {
            var definition = {
                keyframes: keyframes,
                options: options
            };
            this._definitions[name] = definition;

            var self = this;
            this[name] = function (el, options) {
                return self.animate(name, el, options);
            };
            return this;
        }
    };

    Just = new Animator();
})();

(function () {
    for (var animationName in allAnimations) {
        var animation = allAnimations[animationName];
        Just.register(animationName, animation.keyframes, animation.options)
    }
})();