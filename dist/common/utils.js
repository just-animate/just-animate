"use strict";
var global = window;
var requestAnimationFrame = global.requestAnimationFrame;
exports.now = (performance && performance.now)
    ? function () { return performance.now(); }
    : function () { return Date.now(); };
exports.raf = (requestAnimationFrame)
    ? function (ctx, fn) {
        requestAnimationFrame(function () { fn(ctx); });
    }
    : function (ctx, fn) {
        setTimeout(function () { fn(ctx); }, 16.66);
    };
