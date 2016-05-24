"use strict";
exports.rollOut = {
    keyframes: [
        {
            opacity: 1,
            transform: 'none'
        },
        {
            opacity: 0,
            transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)'
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'rollOut'
};
