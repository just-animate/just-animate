"use strict";
exports.fadeInDown = {
    keyframes: [
        {
            opacity: 0,
            y: '-100%'
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
