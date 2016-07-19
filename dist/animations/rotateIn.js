"use strict";
exports.rotateIn = {
    keyframes: [
        {
            transformOrigin: 'center',
            transform: 'rotate3d(0, 0, 1, -200deg)',
            opacity: 0
        },
        {
            transformOrigin: 'center',
            transform: 'none',
            opacity: 1
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'rotateIn'
};
