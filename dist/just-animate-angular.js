/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var easings = __webpack_require__(1);
	var AnimationManager_1 = __webpack_require__(2);
	var animations = __webpack_require__(6);
	angular.module('just.animate', [])
	    .service('just', function () {
	    var animationManager = new AnimationManager_1.AnimationManager();
	    animationManager.configure(undefined, easings);
	    for (var animationName in animations) {
	        if (animations.hasOwnProperty(animationName)) {
	            var animationOptions = animations[animationName];
	            animationManager.register(animationName, animationOptions);
	        }
	    }
	    return animationManager;
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
		"easeInCubic": "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
		"easeOutCubic": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
		"easeInOutCubic": "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
		"easeInCirc": "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
		"easeOutCirc": "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
		"easeInOutCirc": "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
		"easeInExpo": "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
		"easeOutExpo": "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
		"easeInOutExpo": "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
		"easeInQuad": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
		"easeOutQuad": "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
		"easeInOutQuad": "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
		"easeInQuart": "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
		"easeOutQuart": "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
		"easeInOutQuart": "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
		"easeInQuint": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
		"easeOutQuint": "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
		"easeInOutQuint": "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
		"easeInSine": "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
		"easeOutSine": "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
		"easeInOutSine": "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
		"easeInBack": "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
		"easeOutBack": "cubic-bezier(0.175,  0.885, 0.320, 1.275)",
		"easeInOutBack": "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
		"elegantSlowStartEnd": "cubic-bezier(0.175, 0.885, 0.320, 1.275)"
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var helpers_1 = __webpack_require__(3);
	var AnimationRelay_1 = __webpack_require__(4);
	var AnimationSequence_1 = __webpack_require__(5);
	function getElements(source) {
	    if (!source) {
	        throw Error('source is undefined');
	    }
	    if (helpers_1.isString(source)) {
	        return helpers_1.toArray(document.querySelectorAll(source));
	    }
	    if (source instanceof Element) {
	        return [source];
	    }
	    if (helpers_1.isArray(source) || helpers_1.isJQuery(source)) {
	        var elements = [];
	        helpers_1.each(source, function (i) {
	            elements.push.apply(elements, getElements(i));
	        });
	        return elements;
	    }
	    if (helpers_1.isFunction(source)) {
	        var provider = source;
	        var result = provider();
	        return getElements(result);
	    }
	    return [];
	}
	var AnimationManager = (function () {
	    function AnimationManager() {
	        this._definitions = {};
	        this._easings = {};
	        this._timings = {
	            duration: 1000,
	            fill: 'both'
	        };
	    }
	    AnimationManager.prototype.animate = function (keyframesOrName, el, timings) {
	        if (!keyframesOrName) {
	            return;
	        }
	        var keyframes;
	        if (helpers_1.isString(keyframesOrName)) {
	            var definition = this._definitions[keyframesOrName];
	            keyframes = definition.keyframes;
	            timings = helpers_1.extend({}, definition.timings, timings);
	        }
	        else {
	            keyframes = keyframesOrName;
	        }
	        var elements = getElements(el);
	        var players = helpers_1.multiapply(elements, 'animate', [keyframes, timings]);
	        return new AnimationRelay_1.AnimationRelay(players);
	    };
	    AnimationManager.prototype.configure = function (timings, easings) {
	        if (timings) {
	            helpers_1.extend(this._timings, timings);
	        }
	        if (easings) {
	            helpers_1.extend(this._easings, easings);
	        }
	        return this;
	    };
	    AnimationManager.prototype.register = function (name, animationOptions) {
	        this._definitions[name] = animationOptions;
	        var self = this;
	        self[name] = function (el, timings) {
	            return self.animate(name, el, timings);
	        };
	        return self;
	    };
	    AnimationManager.prototype.sequence = function (steps) {
	        var _this = this;
	        var animationSteps = helpers_1.map(steps, function (step) {
	            if (step.command) {
	                return step;
	            }
	            if (!step.name) {
	                return step;
	            }
	            var definition = _this._definitions[step.name];
	            var timings = helpers_1.extend({}, definition.timings);
	            if (step.timings) {
	                timings = helpers_1.extend(timings, step.timings);
	            }
	            return {
	                el: step.el,
	                keyframes: definition.keyframes,
	                timings: timings
	            };
	        });
	        return new AnimationSequence_1.AnimationSequence(this, animationSteps);
	    };
	    return AnimationManager;
	})();
	exports.AnimationManager = AnimationManager;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var ostring = Object.prototype.toString;
	var slice = Array.prototype.slice;
	function noop() {
	    // do nothing
	}
	exports.noop = noop;
	function isArray(a) {
	    return !isString(a) && isNumber(a.length);
	}
	exports.isArray = isArray;
	function isFunction(a) {
	    return ostring.call(a) === '[object Function]';
	}
	exports.isFunction = isFunction;
	function isJQuery(a) {
	    return isFunction(jQuery) && a instanceof jQuery;
	}
	exports.isJQuery = isJQuery;
	function isNumber(a) {
	    return typeof a === 'number';
	}
	exports.isNumber = isNumber;
	function isString(a) {
	    return typeof a === 'string';
	}
	exports.isString = isString;
	function toArray(indexed) {
	    return slice.call(indexed, 0);
	}
	exports.toArray = toArray;
	function each(items, fn) {
	    for (var i = 0, len = items.length; i < len; i++) {
	        fn(items[i]);
	    }
	}
	exports.each = each;
	function map(items, fn) {
	    var results = [];
	    for (var i = 0, len = items.length; i < len; i++) {
	        var result = fn(items[i]);
	        if (result !== undefined) {
	            results.push(result);
	        }
	    }
	    return results;
	}
	exports.map = map;
	function extend(target) {
	    var sources = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        sources[_i - 1] = arguments[_i];
	    }
	    for (var i = 1, len = arguments.length; i < len; i++) {
	        var source = arguments[i];
	        for (var propName in source) {
	            if (source.hasOwnProperty(propName)) {
	                target[propName] = source[propName];
	            }
	        }
	    }
	    return target;
	}
	exports.extend = extend;
	function multiapply(targets, fnName, args, cb) {
	    var errors = [];
	    var results = [];
	    for (var i = 0, len = targets.length; i < len; i++) {
	        try {
	            var target = targets[i];
	            var result = void 0;
	            if (fnName) {
	                result = target[fnName].apply(target, args);
	            }
	            else {
	                result = target.apply(undefined, args);
	            }
	            if (result !== undefined) {
	                results.push(result);
	            }
	        }
	        catch (err) {
	            errors.push(err);
	        }
	    }
	    if (isFunction(cb)) {
	        cb(errors);
	    }
	    return results;
	}
	exports.multiapply = multiapply;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var helpers_1 = __webpack_require__(3);
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var helpers_1 = __webpack_require__(3);
	var AnimationSequence = (function () {
	    function AnimationSequence(manager, steps) {
	        this.onfinish = helpers_1.noop;
	        this._currentIndex = -1;
	        this._isReversed = false;
	        this._manager = manager;
	        this._steps = steps;
	    }
	    AnimationSequence.prototype.finish = function (fn) {
	        this._errorCallback = fn;
	        this._currentIndex = this._isReversed ? this._steps.length : -1;
	        for (var x = 0; x < this._steps.length; x++) {
	            var step = this._steps[x];
	            if (step._animator !== undefined) {
	                step._animator.cancel(fn);
	            }
	        }
	        this.onfinish(undefined);
	        return this;
	    };
	    AnimationSequence.prototype.play = function (fn) {
	        this._errorCallback = fn;
	        this._isReversed = false;
	        this._playThisStep();
	        return this;
	    };
	    AnimationSequence.prototype.pause = function (fn) {
	        this._errorCallback = fn;
	        // ignore pause if not relevant
	        if (!this._isInEffect()) {
	            return this;
	        }
	        var animator = this._getAnimator();
	        animator.pause(fn);
	        return this;
	    };
	    AnimationSequence.prototype.reverse = function (fn) {
	        this._errorCallback = fn;
	        this._isReversed = true;
	        this._playThisStep();
	        return this;
	    };
	    AnimationSequence.prototype.cancel = function (fn) {
	        this._errorCallback = fn;
	        this._isReversed = false;
	        this._currentIndex = -1;
	        for (var x = 0; x < this._steps.length; x++) {
	            var step = this._steps[x];
	            if (step._animator !== undefined) {
	                step._animator.cancel(fn);
	            }
	        }
	        return this;
	    };
	    AnimationSequence.prototype._isInEffect = function () {
	        return this._currentIndex > -1 && this._currentIndex < this._steps.length;
	    };
	    AnimationSequence.prototype._getAnimator = function () {
	        var it = this._steps[this._currentIndex];
	        if (it._animator) {
	            return it._animator;
	        }
	        it._animator = this._manager.animate(it.keyframes, it.el, it.timings);
	        return it._animator;
	    };
	    AnimationSequence.prototype._playNextStep = function (evt) {
	        if (this._isReversed) {
	            this._currentIndex--;
	        }
	        else {
	            this._currentIndex++;
	        }
	        if (this._isInEffect()) {
	            this._playThisStep();
	        }
	        else {
	            this.onfinish(evt);
	        }
	    };
	    AnimationSequence.prototype._playThisStep = function () {
	        var _this = this;
	        if (!this._isInEffect()) {
	            this._currentIndex = this._isReversed ? this._steps.length - 1 : 0;
	        }
	        var animator = this._getAnimator();
	        animator.onfinish = function (evt) {
	            _this._playNextStep(evt);
	        };
	        animator.play(this._errorCallback);
	    };
	    return AnimationSequence;
	})();
	exports.AnimationSequence = AnimationSequence;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports.bounce = __webpack_require__(7);
	exports.bounceIn = __webpack_require__(8);
	exports.bounceInDown = __webpack_require__(9);
	exports.bounceInLeft = __webpack_require__(10);
	exports.bounceInRight = __webpack_require__(11);
	exports.bounceInUp = __webpack_require__(12);
	exports.bounceOut = __webpack_require__(13);
	exports.bounceOutDown = __webpack_require__(14);
	exports.bounceOutLeft = __webpack_require__(15);
	exports.bounceOutRight = __webpack_require__(16);
	exports.bounceOutUp = __webpack_require__(17);
	exports.fadeIn = __webpack_require__(18);
	exports.fadeInDown = __webpack_require__(19);
	exports.fadeInDownBig = __webpack_require__(20);
	exports.fadeInLeft = __webpack_require__(21);
	exports.fadeInLeftBig = __webpack_require__(22);
	exports.fadeInRight = __webpack_require__(23);
	exports.fadeInRightBig = __webpack_require__(24);
	exports.fadeInUp = __webpack_require__(25);
	exports.fadeInUpBig = __webpack_require__(26);
	exports.fadeOut = __webpack_require__(27);
	exports.fadeOutDown = __webpack_require__(28);
	exports.fadeOutDownBig = __webpack_require__(29);
	exports.fadeOutLeft = __webpack_require__(30);
	exports.fadeOutLeftBig = __webpack_require__(31);
	exports.fadeOutRight = __webpack_require__(32);
	exports.fadeOutRightBig = __webpack_require__(33);
	exports.fadeOutUp = __webpack_require__(34);
	exports.fadeOutUpBig = __webpack_require__(35);
	exports.flash = __webpack_require__(36);
	exports.flip = __webpack_require__(37);
	exports.flipInX = __webpack_require__(38);
	exports.flipInY = __webpack_require__(39);
	exports.flipOutX = __webpack_require__(40);
	exports.flipOutY = __webpack_require__(41);
	exports.headShake = __webpack_require__(42);
	exports.hinge = __webpack_require__(43);
	exports.jello = __webpack_require__(44);
	exports.lightSpeedIn = __webpack_require__(45);
	exports.lightSpeedOut = __webpack_require__(46);
	exports.pulse = __webpack_require__(47);
	exports.rollIn = __webpack_require__(48);
	exports.rollOut = __webpack_require__(49);
	exports.rotateIn = __webpack_require__(50);
	exports.rotateInDownLeft = __webpack_require__(51);
	exports.rotateInDownRight = __webpack_require__(52);
	exports.rotateInUpLeft = __webpack_require__(53);
	exports.rotateInUpRight = __webpack_require__(54);
	exports.rotateOut = __webpack_require__(55);
	exports.rotateOutDownLeft = __webpack_require__(56);
	exports.rotateOutDownRight = __webpack_require__(57);
	exports.rotateOutUpLeft = __webpack_require__(58);
	exports.rotateOutUpRight = __webpack_require__(59);
	exports.rubberBand = __webpack_require__(60);
	exports.shake = __webpack_require__(61);
	exports.slideInDown = __webpack_require__(62);
	exports.slideInLeft = __webpack_require__(63);
	exports.slideInRight = __webpack_require__(64);
	exports.slideInUp = __webpack_require__(65);
	exports.slideOutDown = __webpack_require__(66);
	exports.slideOutLeft = __webpack_require__(67);
	exports.slideOutRight = __webpack_require__(68);
	exports.slideOutUp = __webpack_require__(69);
	exports.swing = __webpack_require__(70);
	exports.tada = __webpack_require__(71);
	exports.wobble = __webpack_require__(72);
	exports.zoomIn = __webpack_require__(73);
	exports.zoomInDown = __webpack_require__(74);
	exports.zoomInLeft = __webpack_require__(75);
	exports.zoomInRight = __webpack_require__(76);
	exports.zoomInUp = __webpack_require__(77);
	exports.zoomOut = __webpack_require__(78);
	exports.zoomOutDown = __webpack_require__(79);
	exports.zoomOutLeft = __webpack_require__(80);
	exports.zoomOutRight = __webpack_require__(81);
	exports.zoomOutUp = __webpack_require__(82);


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"offset": 0.2,
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"offset": 0.4,
				"transform": "translate3d(0, -30px, 0)"
			},
			{
				"offset": 0.43,
				"transform": "translate3d(0, -30px, 0)"
			},
			{
				"offset": 0.53,
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"offset": 0.7,
				"transform": "translate3d(0, -15px, 0)"
			},
			{
				"offset": 0.8,
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"offset": 0.9,
				"transform": "translate3d(0, -4px, 0)"
			},
			{
				"offset": 1,
				"transform": "translate3d(0, 0, 0)"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both",
			"easing": "easeOutCubic"
		},
		"name": "bounce"
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "scale3d(.3, .3, .3)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1)"
			},
			{
				"transform": "scale3d(.9, .9, .9)"
			},
			{
				"opacity": 1,
				"transform": "scale3d(1.03, 1.03, 1.03)"
			},
			{
				"transform": "scale3d(.97, .97, .97)"
			},
			{
				"opacity": 1,
				"transform": "scale3d(1, 1, 1)"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both",
			"easing": "easeOutCubic"
		},
		"name": "bounceIn"
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
				"opacity": 0,
				"transform": "translate3d(0, -3000px, 0)"
			},
			{
				"offset": 0.6,
				"easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
				"opacity": 1,
				"transform": "translate3d(0, 25px, 0)"
			},
			{
				"offset": 0.75,
				"easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
				"opacity": 1,
				"transform": "translate3d(0, -10px, 0)"
			},
			{
				"offset": 0.9,
				"easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
				"opacity": 1,
				"transform": "translate3d(0, 5px, 0)"
			},
			{
				"offset": 1,
				"easing": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both",
			"easing": "easeOutCubic"
		},
		"name": "bounceInDown"
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 0,
				"transform": "translate3d(-3000px, 0, 0)"
			},
			{
				"offset": 0.6,
				"opacity": 1,
				"transform": "translate3d(25px, 0, 0)"
			},
			{
				"offset": 0.75,
				"opacity": 1,
				"transform": "translate3d(-10px, 0, 0)"
			},
			{
				"offset": 0.9,
				"opacity": 1,
				"transform": "translate3d(5px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both",
			"easing": "easeOutCubic"
		},
		"name": "bounceInLeft"
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 0,
				"transform": "translate3d(3000px, 0, 0)"
			},
			{
				"offset": 0.6,
				"opacity": 1,
				"transform": "translate3d(-25px, 0, 0)"
			},
			{
				"offset": 0.75,
				"transform": "translate3d(10px, 0, 0)"
			},
			{
				"offset": 0.9,
				"transform": "translate3d(-5px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both",
			"easing": "easeOutCubic"
		},
		"name": "bounceInRight"
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 0,
				"transform": "translate3d(0, 3000px, 0)"
			},
			{
				"offset": 0.6,
				"opacity": 1,
				"transform": "translate3d(0, -20px, 0)"
			},
			{
				"offset": 0.75,
				"opacity": 1,
				"transform": "translate3d(0, 10px, 0)"
			},
			{
				"offset": 0.9,
				"opacity": 1,
				"transform": "translate3d(0, -5px, 0)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "translate3d(0, 0, 0)"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both",
			"easing": "easeOutCubic"
		},
		"name": "bounceInUp"
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none"
			},
			{
				"offset": 0.2,
				"transform": "scale3d(.9, .9, .9)"
			},
			{
				"offset": 0.5,
				"opacity": 1,
				"transform": "scale3d(1.1, 1.1, 1.1)"
			},
			{
				"offset": 0.55,
				"opacity": 1,
				"transform": "scale3d(1.1, 1.1, 1.1)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "scale3d(.3, .3, .3)"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both"
		},
		"name": "bounceOut"
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none"
			},
			{
				"offset": 0.2,
				"transform": "translate3d(0, 10px, 0)"
			},
			{
				"offset": 0.4,
				"opacity": 1,
				"transform": "translate3d(0, -20px, 0)"
			},
			{
				"offset": 0.45,
				"opacity": 1,
				"transform": "translate3d(0, -20px, 0)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "translate3d(0, 2000px, 0)"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both"
		},
		"name": "bounceOutDown"
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none"
			},
			{
				"offset": 0.2,
				"opacity": 1,
				"transform": "translate3d(20px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "translate3d(-2000px, 0, 0)"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both"
		},
		"name": "bounceOutLeft"
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none"
			},
			{
				"offset": 0.2,
				"opacity": 1,
				"transform": "translate3d(-20px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "translate3d(2000px, 0, 0)"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both"
		},
		"name": "bounceOutRight"
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none"
			},
			{
				"offset": 0.2,
				"opacity": 1,
				"transform": "translate3d(0, -10px, 0)"
			},
			{
				"offset": 0.4,
				"opacity": 1,
				"transform": "translate3d(0, 20px, 0)"
			},
			{
				"offset": 0.45,
				"opacity": 1,
				"transform": "translate3d(0, 20px, 0)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "translate3d(0, -2000px, 0)"
			}
		],
		"timings": {
			"duration": 900,
			"fill": "both"
		},
		"name": "bounceOutUp"
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0
			},
			{
				"opacity": 1
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both",
			"easing": "ease-in"
		},
		"name": "fadeIn"
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(0, -100%, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInDown"
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(0, -2000px, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInDownBig"
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(-100%, 0, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInLeft"
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(-2000px, 0, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInLeftBig"
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(100%, 0, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInRight"
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(2000px, 0, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInRightBig"
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(0, 100%, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInUp"
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(0, 2000px, 0)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeInUpBig"
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1
			},
			{
				"opacity": 0
			}
		],
		"timings": {
			"duration": 650,
			"fill": "both"
		},
		"name": "fadeOut"
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(0, 100%, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutDown"
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(0, 2000px, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutDownBig"
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(-100%, 0, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutLeft"
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(-2000px, 0, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutLeftBig"
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(100%, 0, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutRight"
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(2000px, 0, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutRightBig"
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(0, -100%, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutUp"
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(0, -2000px, 0)"
			}
		],
		"timings": {
			"duration": 650
		},
		"name": "fadeOutUpBig"
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1
			},
			{
				"opacity": 0
			},
			{
				"opacity": 1
			},
			{
				"opacity": 0
			},
			{
				"opacity": 1
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "flash"
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "perspective(400px) rotate3d(0, 1, 0, -360deg)"
			},
			{
				"offset": 0.4,
				"transform": "perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)"
			},
			{
				"offset": 0.5,
				"transform": "perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)"
			},
			{
				"offset": 0.8,
				"transform": "perspective(400px) scale3d(.95, .95, .95)"
			},
			{
				"offset": 1,
				"transform": "perspective(400px)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "flip"
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "perspective(400px) rotate3d(1, 0, 0, 90deg)",
				"easing": "ease-in ",
				"opacity": 0
			},
			{
				"offset": 0.4,
				"transform": "perspective(400px) rotate3d(1, 0, 0, -20deg)",
				"easing": "ease-in "
			},
			{
				"offset": 0.6,
				"transform": "perspective(400px) rotate3d(1, 0, 0, 10deg)",
				"opacity": 1
			},
			{
				"offset": 0.8,
				"transform": "perspective(400px) rotate3d(1, 0, 0, -5deg)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "perspective(400px)"
			}
		],
		"timings": {
			"duration": 750
		},
		"name": "flipInX"
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "perspective(400px) rotate3d(0, 1, 0, 90deg)",
				"opacity": 0
			},
			{
				"offset": 0.4,
				"transform": "perspective(400px) rotate3d(0, 1, 0, -20deg)"
			},
			{
				"offset": 0.6,
				"transform": "perspective(400px) rotate3d(0, 1, 0, 10deg)",
				"opacity": 1
			},
			{
				"offset": 0.8,
				"transform": "perspective(400px) rotate3d(0, 1, 0, -5deg)"
			},
			{
				"offset": 1,
				"transform": "perspective(400px)",
				"opacity": 1
			}
		],
		"timings": {
			"duration": 750
		},
		"name": "flipInY"
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "perspective(400px)",
				"opacity": 1
			},
			{
				"offset": 0.3,
				"transform": "perspective(400px) rotate3d(1, 0, 0, -20deg)",
				"opacity": 1
			},
			{
				"offset": 1,
				"transform": "perspective(400px) rotate3d(1, 0, 0, 90deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 750
		},
		"name": "flipOutX"
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "perspective(400px)",
				"opacity": 1
			},
			{
				"offset": 0.3,
				"transform": "perspective(400px) rotate3d(0, 1, 0, -15deg)",
				"opacity": 1
			},
			{
				"offset": 1,
				"transform": "perspective(400px) rotate3d(0, 1, 0, 90deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 750
		},
		"name": "flipOutY"
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "translateX(0)"
			},
			{
				"offset": 0.065,
				"transform": "translateX(-6px) rotateY(-9deg)"
			},
			{
				"offset": 0.185,
				"transform": "translateX(5px) rotateY(7deg)"
			},
			{
				"offset": 0.315,
				"transform": "translateX(-3px) rotateY(-5deg)"
			},
			{
				"offset": 0.435,
				"transform": "translateX(2px) rotateY(3deg)"
			},
			{
				"offset": 0.5,
				"transform": "translateX(0)"
			},
			{
				"offset": 1,
				"transform": "translateX(0)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "headShake"
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "none",
				"transform-origin": "top left",
				"opacity": 1
			},
			{
				"transform": "rotate3d(0, 0, 1, 80deg)",
				"opacity": 1
			},
			{
				"transform": "rotate3d(0, 0, 1, 60deg)",
				"opacity": 1
			},
			{
				"transform": "rotate3d(0, 0, 1, 80deg)",
				"opacity": 0
			},
			{
				"transform": "rotate3d(0, 0, 1, 60deg)",
				"opacity": 1
			},
			{
				"transform": "translate3d(0, 700px, 0)",
				"transform-origin": "top left",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 2000
		},
		"name": "hinge"
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "none"
			},
			{
				"offset": 0.111,
				"transform": "none"
			},
			{
				"offset": 0.222,
				"transform": "skewX(-12.5deg) skewY(-12.5deg)"
			},
			{
				"offset": 0.333,
				"transform": "skewX(6.25deg) skewY(6.25deg)"
			},
			{
				"offset": 0.444,
				"transform": "skewX(-3.125deg) skewY(-3.125deg)"
			},
			{
				"offset": 0.555,
				"transform": "skewX(1.5625deg) skewY(1.5625deg)"
			},
			{
				"offset": 0.666,
				"transform": "skewX(-0.78125deg) skewY(-0.78125deg)"
			},
			{
				"offset": 0.777,
				"transform": "skewX(0.390625deg) skewY(0.390625deg)"
			},
			{
				"offset": 0.888,
				"transform": "skewX(-0.1953125deg) skewY(-0.1953125deg)"
			},
			{
				"offset": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000,
			"fill": "both",
			"easing": "ease-in-out"
		},
		"name": "jello"
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "translate3d(100%, 0, 0) skewX(-30deg)",
				"opacity": 0
			},
			{
				"offset": 0.6,
				"transform": "skewX(20deg)",
				"opacity": 1
			},
			{
				"offset": 0.8,
				"transform": "skewX(-5deg)",
				"opacity": 1
			},
			{
				"offset": 1,
				"transform": "none",
				"opacity": 1
			}
		],
		"timings": {
			"duration": 1000,
			"fill": "both",
			"easing": "ease-out"
		},
		"name": "lightSpeedIn"
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "none",
				"opacity": 1
			},
			{
				"transform": "translate3d(100%, 0, 0) skewX(30deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 1000,
			"fill": "both",
			"easing": "ease-in"
		},
		"name": "lightSpeedOut"
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "scale3d(1, 1, 1)"
			},
			{
				"transform": "scale3d(1.05, 1.05, 1.05)"
			},
			{
				"transform": "scale3d(1, 1, 1)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "pulse"
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)"
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rollIn"
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none"
			},
			{
				"opacity": 0,
				"transform": "translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rollOut"
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "center",
				"transform": "rotate3d(0, 0, 1, -200deg)",
				"opacity": 0
			},
			{
				"transform-origin": "center",
				"transform": "none",
				"opacity": 1
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateIn"
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "left bottom",
				"transform": "rotate3d(0, 0, 1, -45deg)",
				"opacity": 0
			},
			{
				"transform-origin": "left bottom",
				"transform": "none",
				"opacity": 1
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateInDownLeft"
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "right bottom",
				"transform": "rotate3d(0, 0, 1, 45deg)",
				"opacity": 0
			},
			{
				"transform-origin": "right bottom",
				"transform": "none",
				"opacity": 1
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateInDownRight"
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "left bottom",
				"transform": "rotate3d(0, 0, 1, 45deg)",
				"opacity": 0
			},
			{
				"transform-origin": "left bottom",
				"transform": "none",
				"opacity": 1
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateInUpLeft"
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "right bottom",
				"transform": "rotate3d(0, 0, 1, -90deg)",
				"opacity": 0
			},
			{
				"transform-origin": "right bottom",
				"transform": "none",
				"opacity": 1
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateInUpRight"
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "center",
				"transform": "none",
				"opacity": 1
			},
			{
				"transform-origin": "center",
				"transform": "rotate3d(0, 0, 1, 200deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateOut"
	};

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "left bottom",
				"transform": "none",
				"opacity": 1
			},
			{
				"transform-origin": "left bottom",
				"transform": "rotate3d(0, 0, 1, 45deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateOutDownLeft"
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "right bottom",
				"transform": "none",
				"opacity": 1
			},
			{
				"transform-origin": "right bottom",
				"transform": "rotate3d(0, 0, 1, -45deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateOutDownRight"
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "left bottom",
				"transform": "none",
				"opacity": 1
			},
			{
				"transform-origin": "left bottom",
				"transform": "rotate3d(0, 0, 1, -45deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateOutUpLeft"
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform-origin": "right bottom",
				"transform": "none",
				"opacity": 1
			},
			{
				"transform-origin": "right bottom",
				"transform": "rotate3d(0, 0, 1, 90deg)",
				"opacity": 0
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rotateOutUpRight"
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "scale3d(1, 1, 1)"
			},
			{
				"offset": 0.3,
				"transform": "scale3d(1.25, 0.75, 1)"
			},
			{
				"offset": 0.4,
				"transform": "scale3d(0.75, 1.25, 1)"
			},
			{
				"offset": 0.5,
				"transform": "scale3d(1.15, 0.85, 1)"
			},
			{
				"offset": 0.65,
				"transform": "scale3d(.95, 1.05, 1)"
			},
			{
				"offset": 0.75,
				"transform": "scale3d(1.05, .95, 1)"
			},
			{
				"offset": 1,
				"transform": "scale3d(1, 1, 1)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "rubberBand"
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"transform": "translate3d(-10px, 0, 0)"
			},
			{
				"transform": "translate3d(10px, 0, 0)"
			},
			{
				"transform": "translate3d(-10px, 0, 0)"
			},
			{
				"transform": "translate3d(10px, 0, 0)"
			},
			{
				"transform": "translate3d(-10px, 0, 0)"
			},
			{
				"transform": "translate3d(10px, 0, 0)"
			},
			{
				"transform": "translate3d(-10px, 0, 0)"
			},
			{
				"transform": "translate3d(10px, 0, 0)"
			},
			{
				"transform": "translate3d(-10px, 0, 0)"
			},
			{
				"transform": "translate3d(0, 0, 0)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "shake"
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "translate3d(0, -100%, 0)",
				"visibility": "hidden"
			},
			{
				"transform": "translate3d(0, 0, 0)",
				"visibility": "visible"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideInDown"
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "translate3d(-100%, 0, 0)",
				"visibility": "hidden"
			},
			{
				"transform": "translate3d(0, 0, 0)",
				"visibility": "visible"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideInLeft"
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "translate3d(100%, 0, 0)",
				"visibility": "hidden"
			},
			{
				"transform": "translate3d(0, 0, 0)",
				"visibility": "visible"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideInRight"
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "translate3d(0, 100%, 0)",
				"visibility": "hidden"
			},
			{
				"transform": "translate3d(0, 0, 0)",
				"visibility": "visible"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideInUp"
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "translate3d(0, 0, 0)",
				"visibility": "visible"
			},
			{
				"visibility": "hidden",
				"transform": "translate3d(0, 100%, 0)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideOutDown"
	};

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"visibility": "visible",
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"visibility": "hidden",
				"transform": "translate3d(-100%, 0, 0)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideOutLeft"
	};

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"visibility": "visible",
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"visibility": "hidden",
				"transform": "translate3d(100%, 0, 0)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideOutRight"
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"visibility": "visible",
				"transform": "translate3d(0, 0, 0)"
			},
			{
				"visibility": "hidden",
				"transform": "translate3d(0, -100%, 0)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "slideOutUp"
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "none"
			},
			{
				"transform": "rotate3d(0, 0, 1, 15deg)"
			},
			{
				"transform": "rotate3d(0, 0, 1, -10deg)"
			},
			{
				"transform": "rotate3d(0, 0, 1, 5deg)"
			},
			{
				"transform": "rotate3d(0, 0, 1, -5deg)"
			},
			{
				"transform": "rotate3d(0, 0, 1, 0deg)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "swing"
	};

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"transform": "scale3d(1, 1, 1)"
			},
			{
				"transform": "scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)"
			},
			{
				"transform": "scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)"
			},
			{
				"transform": "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)"
			},
			{
				"transform": "scale3d(1, 1, 1)"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "tada"
	};

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"transform": "none"
			},
			{
				"offset": 0.15,
				"transform": "translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)"
			},
			{
				"offset": 0.3,
				"transform": "translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)"
			},
			{
				"offset": 0.45,
				"transform": "translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)"
			},
			{
				"offset": 0.6,
				"transform": "translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)"
			},
			{
				"offset": 0.75,
				"transform": "translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)"
			},
			{
				"offset": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000
		},
		"name": "wobble"
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 0,
				"transform": "scale3d(.3, .3, .3)"
			},
			{
				"opacity": 1
			},
			{
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomIn"
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 0,
				"transform": "scale3d(.1, .1, .1) translate3d(0, -1000px, 0)"
			},
			{
				"offset": 0.6,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(0, 60px, 0)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "easeInCubic"
		},
		"name": "zoomInDown"
	};

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 0,
				"transform": "scale3d(.1, .1, .1) translate3d(-1000px, 0, 0)"
			},
			{
				"offset": 0.6,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(10px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomInLeft"
	};

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 0,
				"transform": "scale3d(.1, .1, .1) translate3d(1000px, 0, 0)"
			},
			{
				"offset": 0.6,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(-10px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomInRight"
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 0,
				"transform": "scale3d(.1, .1, .1) translate3d(0, 1000px, 0)"
			},
			{
				"offset": 0.6,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(0, -60px, 0)"
			},
			{
				"offset": 1,
				"opacity": 1,
				"transform": "none"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomInUp"
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"opacity": 1,
				"transform": "none",
				"transform-origin": "center middle"
			},
			{
				"opacity": 0,
				"transform": "scale3d(.3, .3, .3)"
			},
			{
				"opacity": 0,
				"transform": "none",
				"transform-origin": "center middle"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomOut"
	};

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none",
				"transform-origin": "center bottom"
			},
			{
				"offset": 0.4,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(0, -60px, 0)",
				"transform-origin": "center bottom"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "scale3d(.1, .1, .1) translate3d(0, 2000px, 0)",
				"transform-origin": "center bottom"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomOutDown"
	};

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none",
				"transform-origin": "left center"
			},
			{
				"offset": 0.4,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(42px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "scale(.1) translate3d(-2000px, 0, 0)",
				"transform-origin": "left center"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomOutLeft"
	};

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none",
				"transform-origin": "right center"
			},
			{
				"offset": 0.4,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(-42px, 0, 0)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "scale(.1) translate3d(2000px, 0, 0)",
				"transform-origin": "right center"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomOutRight"
	};

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = {
		"keyframes": [
			{
				"offset": 0,
				"opacity": 1,
				"transform": "none",
				"transform-origin": "center bottom"
			},
			{
				"offset": 0.4,
				"opacity": 1,
				"transform": "scale3d(.475, .475, .475) translate3d(0, 60px, 0)"
			},
			{
				"offset": 1,
				"opacity": 0,
				"transform": "scale3d(.1, .1, .1) translate3d(0, -2000px, 0)",
				"transform-origin": "center bottom"
			}
		],
		"timings": {
			"duration": 1000,
			"easing": "elegantSlowStartEnd"
		},
		"name": "zoomOutUp"
	};

/***/ }
/******/ ]);