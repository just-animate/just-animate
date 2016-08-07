"use strict";
var resources_1 = require('../helpers/resources');
var now = (performance && performance.now) ? function () { return performance.now(); } : function () { return Date.now(); };
var raf = (window.requestAnimationFrame !== resources_1.nothing)
    ? function (ctx, fn) {
        window.requestAnimationFrame(function () { fn(ctx); });
    }
    : function (ctx, fn) {
        setTimeout(function () { fn(ctx); }, 16.66);
    };
function TimeLoop() {
    var self = this instanceof TimeLoop ? this : Object.create(TimeLoop.prototype);
    self.active = [];
    self.elapses = [];
    self.isActive = resources_1.nothing;
    self.lastTime = resources_1.nothing;
    self.offs = [];
    self.ons = [];
    return self;
}
exports.TimeLoop = TimeLoop;
TimeLoop.prototype = {
    on: function (fn) {
        var self = this;
        var offIndex = self.offs.indexOf(fn);
        if (offIndex !== -1) {
            self.offs.splice(offIndex, 1);
        }
        if (self.ons.indexOf(fn) === -1) {
            self.ons.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    },
    off: function (fn) {
        var self = this;
        var onIndex = self.ons.indexOf(fn);
        if (onIndex !== -1) {
            self.ons.splice(onIndex, 1);
        }
        if (self.offs.indexOf(fn) === -1) {
            self.offs.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    }
};
function update(self) {
    updateOffs(self);
    updateOns(self);
    var callbacks = self.active;
    var elapses = self.elapses;
    var len = callbacks.length;
    var lastTime = self.lastTime || now();
    var thisTime = now();
    var delta = thisTime - lastTime;
    // if nothing is subscribed, kill the cycle
    if (!len) {
        // end recursion
        self.isActive = resources_1.nothing;
        self.lastTime = resources_1.nothing;
        return;
    }
    // ensure running and requestAnimationFrame is called
    self.isActive = true;
    self.lastTime = thisTime;
    raf(self, update);
    for (var i = 0; i < len; i++) {
        // update delta and save result
        var existingElapsed = elapses[i];
        var updatedElapsed = existingElapsed + delta;
        elapses[i] = updatedElapsed;
        // call sub with updated delta
        callbacks[i](delta, updatedElapsed);
    }
}
function updateOffs(self) {
    var len = self.offs.length;
    for (var i = 0; i < len; i++) {
        var fn = self.offs[i];
        var indexOfSub = self.active.indexOf(fn);
        if (indexOfSub !== -1) {
            self.active.splice(indexOfSub, 1);
            self.elapses.splice(indexOfSub, 1);
        }
    }
}
function updateOns(self) {
    var len = self.ons.length;
    for (var i = 0; i < len; i++) {
        var fn = self.ons[i];
        if (self.active.indexOf(fn) === -1) {
            self.active.push(fn);
            self.elapses.push(0);
        }
    }
}
