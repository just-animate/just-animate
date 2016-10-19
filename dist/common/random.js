"use strict";
function shuffle(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}
exports.shuffle = shuffle;
function random(first, last, unit, wholeNumbersOnly) {
    var val = first + (Math.random() * (last - first));
    if (wholeNumbersOnly === true) {
        val = Math.floor(val);
    }
    if (!unit) {
        return val;
    }
    return val + unit;
}
exports.random = random;
