"use strict";
exports.rotateInDownRight = {
    keyframes: [
        {
            transformOrigin: 'right bottom',
            transform: 'rotate3d(0, 0, 1, 45deg)',
            opacity: 0
        },
        {
            transformOrigin: 'right bottom',
            transform: 'none',
            opacity: 1
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'rotateInDownRight'
};
