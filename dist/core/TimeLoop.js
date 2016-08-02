"use strict";
var now = (performance && performance.now) ? function () { return performance.now(); } : function () { return Date.now(); };
var raf = (window && window.requestAnimationFrame) || (function (fn) { return setTimeout(fn, 16.66); });
var TimeLoop = (function () {
    function TimeLoop() {
        this._isActive = false;
        this._lastTime = undefined;
        this._ons = [];
        this._offs = [];
        this._active = [];
        this._elapses = [];
        this._update = this._update.bind(this);
    }
    TimeLoop.prototype.subscribe = function (fn) {
        var offIndex = this._offs.indexOf(fn);
        if (offIndex !== -1) {
            this._offs.splice(offIndex, 1);
        }
        if (this._ons.indexOf(fn) === -1) {
            this._ons.push(fn);
        }
        if (!this._isActive) {
            this._isActive = true;
            raf(this._update);
        }
    };
    TimeLoop.prototype.unsubscribe = function (fn) {
        var onIndex = this._ons.indexOf(fn);
        if (onIndex !== -1) {
            this._ons.splice(onIndex, 1);
        }
        if (this._offs.indexOf(fn) === -1) {
            this._offs.push(fn);
        }
        if (!this._isActive) {
            this._isActive = true;
            raf(this._update);
        }
    };
    TimeLoop.prototype._update = function () {
        this._updateOffs();
        this._updateOns();
        var callbacks = this._active;
        var elapses = this._elapses;
        var len = callbacks.length;
        var lastTime = this._lastTime || now();
        var thisTime = now();
        var delta = thisTime - lastTime;
        // if nothing is subscribed, kill the cycle
        if (!len) {
            // end recursion
            this._isActive = false;
            this._lastTime = undefined;
            return;
        }
        // ensure running and requestAnimationFrame is called
        this._isActive = true;
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
    TimeLoop.prototype._updateOffs = function () {
        var len = this._offs.length;
        for (var i = 0; i < len; i++) {
            var fn = this._offs[i];
            var indexOfSub = this._active.indexOf(fn);
            if (indexOfSub !== -1) {
                this._active.splice(indexOfSub, 1);
                this._elapses.splice(indexOfSub, 1);
            }
        }
    };
    TimeLoop.prototype._updateOns = function () {
        var len = this._ons.length;
        for (var i = 0; i < len; i++) {
            var fn = this._ons[i];
            if (this._active.indexOf(fn) === -1) {
                this._active.push(fn);
                this._elapses.push(0);
            }
        }
    };
    return TimeLoop;
}());
exports.TimeLoop = TimeLoop;
