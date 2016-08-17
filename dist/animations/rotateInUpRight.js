"use strict";
exports.rotateInUpRight = {
    css: [
        {
            transformOrigin: 'right bottom',
            transform: 'rotate3d(0, 0, 1, -90deg)',
            opacity: 0
        },
        {
            transformOrigin: 'right bottom',
            transform: 'none',
            opacity: 1
        }
    ],
    to: 1000,
    name: 'rotateInUpRight'
};
