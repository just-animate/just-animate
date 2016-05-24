"use strict";
exports.rotateInUpRight = {
    keyframes: [
        {
            'transform-origin': 'right bottom',
            transform: 'rotate3d(0, 0, 1, -90deg)',
            opacity: 0
        },
        {
            'transform-origin': 'right bottom',
            transform: 'none',
            opacity: 1
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'rotateInUpRight'
};
