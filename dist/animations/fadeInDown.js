"use strict";
exports.fadeInDown = {
    keyframes: [
        {
            opacity: 0,
            translate3d: ['0', '-100%', '0']
        },
        {
            opacity: 1,
            transform: 'none'
        }
    ],
    timings: {
        duration: 650,
        fill: 'both'
    },
    name: 'fadeInDown'
};
