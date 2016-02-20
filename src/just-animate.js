'use strict';
var Just;
(function () {
    function Animator() {
        this._definitions = {};
    }

    Animator.prototype = {
        animate: function (name, el, options) {
            if (typeof name === 'undefined') {
                throw Error("Just.animate() requires an animation name as the first argument")
            }

            var definition = this._definitions[name];
            if (typeof definition === 'undefined') {
                throw Error("animation \"" + name + "\" was not found")
            }

            var options2 = options || definition.options;
            el.animate(definition.keyframes, options2);
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