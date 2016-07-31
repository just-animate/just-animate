"use strict";
var elements_1 = require('../helpers/elements');
var lists_1 = require('../helpers/lists');
function createKeyframeAnimator(targets, keyframes, timings) {
    // get list of elements to animate
    var elements = elements_1.queryElements(targets);
    var animators = lists_1.map(elements, function (e) {
        var a = e.animate(keyframes, timings);
        a.pause();
        return a;
    });
    return animators;
}
exports.createKeyframeAnimator = createKeyframeAnimator;
