"use strict";
exports.rotateIn = {
    keyframes: [
        {
            'transform-origin': 'center',
            transform: 'rotate3d(0, 0, 1, -200deg)',
            opacity: 0
        },
        {
            'transform-origin': 'center',
            transform: 'none',
            opacity: 1
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'rotateIn'
};
