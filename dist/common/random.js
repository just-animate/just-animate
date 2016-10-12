"use strict";
function shuffle(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}
exports.shuffle = shuffle;
function random(first, last) {
    return Math.floor(first + (Math.random() * (last - first)));
}
exports.random = random;
