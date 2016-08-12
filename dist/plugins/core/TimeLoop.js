"use strict";
var resources_1 = require('../../common/resources');
var utils_1 = require('../../common/utils');
function TimeLoop() {
    var self = this instanceof TimeLoop ? this : Object.create(TimeLoop.prototype);
    self.active = [];
    self.elapses = [];
    self.isActive = resources_1.nil;
    self.lastTime = resources_1.nil;
    self.offs = [];
    self.ons = [];
    return self;
}
exports.TimeLoop = TimeLoop;
TimeLoop.prototype = {
    on: function (fn) {
        var self = this;
        var offs = self.offs;
        var ons = self.ons;
        var offIndex = offs.indexOf(fn);
        if (offIndex !== -1) {
            offs.splice(offIndex, 1);
        }
        if (ons.indexOf(fn) === -1) {
            ons.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            utils_1.raf(self, update);
        }
    },
    off: function (fn) {
        var self = this;
        var offs = self.offs;
        var ons = self.ons;
        var onIndex = ons.indexOf(fn);
        if (onIndex !== -1) {
            ons.splice(onIndex, 1);
        }
        if (offs.indexOf(fn) === -1) {
            offs.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            utils_1.raf(self, update);
        }
    }
};
function update(self) {
    updateOffs(self);
    updateOns(self);
    var callbacks = self.active;
    var elapses = self.elapses;
    var len = callbacks.length;
    var lastTime = self.lastTime || utils_1.now();
    var thisTime = utils_1.now();
    var delta = thisTime - lastTime;
    // if nil is subscribed, kill the cycle
    if (!len) {
        // end recursion
        self.isActive = resources_1.nil;
        self.lastTime = resources_1.nil;
        return;
    }
    // ensure running and requestAnimationFrame is called
    self.isActive = true;
    self.lastTime = thisTime;
    utils_1.raf(self, update);
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
    var active = self.active;
    for (var i = 0; i < len; i++) {
        var fn = self.offs[i];
        var indexOfSub = active.indexOf(fn);
        if (indexOfSub !== -1) {
            active.splice(indexOfSub, 1);
            self.elapses.splice(indexOfSub, 1);
        }
    }
}
function updateOns(self) {
    var len = self.ons.length;
    var active = self.active;
    for (var i = 0; i < len; i++) {
        var fn = self.ons[i];
        if (active.indexOf(fn) === -1) {
            active.push(fn);
            self.elapses.push(0);
        }
    }
}
