"use strict";
exports.bounceIn = {
    name: 'bounceIn',
    keyframes: [
        {
            opacity: 0,
            scale: .3
        },
        {
            scale: 1.1
        },
        {
            scale: .9
        },
        {
            opacity: 1,
            scale: 1.03
        },
        {
            scale: .97
        },
        {
            opacity: 1,
            scale: 1
        }
    ],
    to: 900,
    fill: 'both',
    easing: 'easeOutCubic'
};
