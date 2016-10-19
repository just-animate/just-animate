"use strict";
function now() {
    return performance && performance.now ? performance.now() : Date.now();
}
exports.now = now;
function raf(ctx, fn) {
    var callback = function () { fn(ctx); };
    return requestAnimationFrame
        ? requestAnimationFrame(callback)
        : setTimeout(callback, 16.66);
}
exports.raf = raf;
