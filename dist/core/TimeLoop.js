"use strict";
var now = (performance && performance.now) ? function () { return performance.now(); } : function () { return Date.now(); };
var raf = (window && window.requestAnimationFrame) || (function (fn) { return setTimeout(fn, 16.66); });
var TimeLoop = (function () {
    function TimeLoop() {
        this._isRunning = false;
        this._lastTime = undefined;
        this._callbacks = [];
        this._elapses = [];
        this._update = this._update.bind(this);
    }
    TimeLoop.prototype.subscribe = function (fn) {
        if (this._callbacks.indexOf(fn) !== -1) {
            return;
        }
        this._callbacks.push(fn);
        this._elapses.push(0);
        if (!this._isRunning) {
            this._isRunning = true;
            raf(this._update);
        }
    };
    TimeLoop.prototype.unsubscribe = function (fn) {
        var indexOfSub = this._callbacks.indexOf(fn);
        if (indexOfSub === -1) {
            return;
        }
        this._callbacks.splice(indexOfSub, 1);
        this._elapses.splice(indexOfSub, 1);
    };
    TimeLoop.prototype._update = function () {
        var callbacks = this._callbacks;
        var elapses = this._elapses;
        var len = callbacks.length;
        var lastTime = this._lastTime || now();
        var thisTime = now();
        var delta = thisTime - lastTime;
        // if nothing is subscribed, kill the cycle
        if (!len) {
            // end recursion
            this._isRunning = false;
            this._lastTime = undefined;
            return;
        }
        // ensure running and requestAnimationFrame is called
        this._isRunning = true;
        this._lastTime = thisTime;
        raf(this._update);
        for (var i = 0; i < len; i++) {
            // update delta and save result
            var existingElapsed = elapses[i];
            var updatedElapsed = existingElapsed + delta;
            elapses[i] = updatedElapsed;
            // call sub with updated delta
            callbacks[i](delta, updatedElapsed);
        }
    };
    return TimeLoop;
}());
exports.TimeLoop = TimeLoop;
