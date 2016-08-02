"use strict";
var lists_1 = require('../helpers/lists');
var Dispatcher_1 = require('./Dispatcher');
var call = 'call';
var set = 'set';
var finish = 'finish';
var cancel = 'cancel';
var play = 'play';
var pause = 'pause';
var reverse = 'reverse';
var running = 'running';
var pending = 'pending';
var Animator = (function () {
    function Animator(effects, timeLoop) {
        var _this = this;
        effects = effects || [];
        var dispatcher = new Dispatcher_1.Dispatcher();
        var firstEffect = lists_1.head(effects);
        if (firstEffect) {
            firstEffect.on(finish, function () {
                _this._dispatcher.trigger(finish);
                _this._timeLoop.unsubscribe(_this._tick);
            });
        }
        lists_1.each(effects, function (effect) {
            dispatcher.on(set, function (propName, propValue) { effect[propName] = propValue; });
            dispatcher.on(call, function (functionName) { effect[functionName](); });
        });
        this._duration = lists_1.maxBy(effects, function (e) { return e.totalDuration; });
        this._tick = this._tick.bind(this);
        this._dispatcher = dispatcher;
        this._timeLoop = timeLoop;
        this._effects = effects;
    }
    Object.defineProperty(Animator.prototype, "currentTime", {
        get: function () {
            return this._currentTime;
        },
        set: function (value) {
            this._currentTime = value;
            this._dispatcher.trigger(set, ['currentTime', value]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "playbackRate", {
        get: function () {
            return this._playbackRate;
        },
        set: function (value) {
            this._playbackRate = value;
            this._dispatcher.trigger(set, ['playbackRate', value]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "playState", {
        get: function () {
            return this._playState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "iterationStart", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "iterations", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "endTime", {
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "startTime", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "totalDuration", {
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    Animator.prototype.on = function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
        return this;
    };
    Animator.prototype.off = function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
        return this;
    };
    Animator.prototype.cancel = function () {
        this._dispatcher.trigger(call, [cancel]);
        this.currentTime = 0;
        this._dispatcher.trigger(cancel);
        return this;
    };
    Animator.prototype.finish = function () {
        this._dispatcher.trigger(call, [finish]);
        this.currentTime = this.playbackRate < 0 ? 0 : this.duration;
        this._dispatcher.trigger(finish);
        return this;
    };
    Animator.prototype.play = function () {
        this._dispatcher.trigger(call, [play]);
        this._dispatcher.trigger(play);
        this._timeLoop.subscribe(this._tick);
        return this;
    };
    Animator.prototype.pause = function () {
        this._dispatcher.trigger(call, [pause]);
        this._dispatcher.trigger(pause);
        return this;
    };
    Animator.prototype.reverse = function () {
        this._dispatcher.trigger(call, [reverse]);
        this._dispatcher.trigger(reverse);
        return this;
    };
    Animator.prototype._tick = function () {
        this._dispatcher.trigger('update', [this.currentTime]);
        var firstEffect = lists_1.head(this._effects);
        this._currentTime = firstEffect.currentTime;
        this._playbackRate = firstEffect.playbackRate;
        this._playState = firstEffect.playState;
        if (this._playState !== running && this._playState !== pending) {
            this._timeLoop.unsubscribe(this._tick);
        }
    };
    return Animator;
}());
exports.Animator = Animator;
