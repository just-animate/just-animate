"use strict";
var lists_1 = require('../helpers/lists');
var type_1 = require('../helpers/type');
var Dispatcher_1 = require('./Dispatcher');
var call = 'call';
var finish = 'finish';
var cancel = 'cancel';
var play = 'play';
var pause = 'pause';
var reverse = 'reverse';
var running = 'running';
var pending = 'pending';
var multiAnimatorProtoType = {
    currentTime: function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._currentTime;
        }
        self._currentTime = value;
        self._dispatcher.trigger(call, ['currentTime', value]);
        return self;
    },
    playbackRate: function (value) {
        var self = this;
        if (!type_1.isDefined(value)) {
            return self._currentTime;
        }
        self._playbackRate = value;
        self._dispatcher.trigger(call, ['playbackRate', value]);
        return self;
    },
    playState: function () {
        return this._playState;
    },
    duration: function () {
        return this._duration;
    },
    iterationStart: function () {
        return 0;
    },
    iterations: function () {
        return 1;
    },
    endTime: function () {
        return this._duration;
    },
    startTime: function () {
        return 0;
    },
    totalDuration: function () {
        return this._duration;
    },
    on: function (eventName, listener) {
        this._dispatcher.on(eventName, listener);
        return this;
    },
    off: function (eventName, listener) {
        this._dispatcher.off(eventName, listener);
        return this;
    },
    cancel: function () {
        var self = this;
        self._dispatcher.trigger(call, [cancel]);
        self.currentTime(0);
        self._dispatcher.trigger(cancel);
        return self;
    },
    finish: function () {
        var self = this;
        self._dispatcher.trigger(call, [finish]);
        self.currentTime(self._playbackRate < 0 ? 0 : self._duration);
        self._dispatcher.trigger(finish);
        return self;
    },
    play: function () {
        var self = this;
        self._dispatcher.trigger(call, [play]);
        self._dispatcher.trigger(play);
        self._timeLoop.on(self._tick);
        return self;
    },
    pause: function () {
        var self = this;
        self._dispatcher.trigger(call, [pause]);
        self._dispatcher.trigger(pause);
        return self;
    },
    reverse: function () {
        var self = this;
        self._dispatcher.trigger(call, [reverse]);
        self._dispatcher.trigger(reverse);
        return self;
    },
    _tick: function () {
        var self = this;
        var firstEffect = lists_1.head(self._effects);
        self._dispatcher.trigger('update', [self.currentTime]);
        self._currentTime = firstEffect.currentTime();
        self._playbackRate = firstEffect.playbackRate();
        self._playState = firstEffect.playState();
        if (self._playState !== running && self._playState !== pending) {
            self._timeLoop.off(self._tick);
        }
    }
};
function createMultiAnimator(effects, timeLoop) {
    var self = Object.create(multiAnimatorProtoType);
    effects = effects || [];
    var dispatcher = Dispatcher_1.createDispatcher();
    var firstEffect = lists_1.head(effects);
    if (firstEffect) {
        firstEffect.on(finish, function () {
            self._dispatcher.trigger(finish);
            self._timeLoop.off(self._tick);
        });
    }
    lists_1.each(effects, function (effect) {
        dispatcher.on(call, function (functionName, arg1) { effect[functionName](arg1); });
    });
    self._duration = lists_1.maxBy(effects, function (e) { return e.totalDuration(); });
    self._tick = self._tick.bind(self);
    self._dispatcher = dispatcher;
    self._timeLoop = timeLoop;
    self._effects = effects;
    return self;
}
exports.createMultiAnimator = createMultiAnimator;
