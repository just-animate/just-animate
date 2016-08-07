"use strict";
exports.hinge = {
    keyframes: [
        {
            transform: 'none',
            transformOrigin: 'top left',
            opacity: 1
        },
        {
            transform: 'rotate3d(0, 0, 1, 80deg)',
            opacity: 1
        },
        {
            transform: 'rotate3d(0, 0, 1, 60deg)',
            opacity: 1
        },
        {
            transform: 'rotate3d(0, 0, 1, 80deg)',
            opacity: 0
        },
        {
            transform: 'rotate3d(0, 0, 1, 60deg)',
            opacity: 1
        },
        {
            transform: 'translate3d(0, 700px, 0)',
            transformOrigin: 'top left',
            opacity: 0
        }
    ],
    to: 2000,
    name: 'hinge'
};
