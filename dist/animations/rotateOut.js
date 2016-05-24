"use strict";
exports.rotateOut = {
    keyframes: [
        {
            'transform-origin': 'center',
            transform: 'none',
            opacity: 1
        },
        {
            'transform-origin': 'center',
            transform: 'rotate3d(0, 0, 1, 200deg)',
            opacity: 0
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'rotateOut'
};
