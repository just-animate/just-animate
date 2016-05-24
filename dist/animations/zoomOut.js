"use strict";
exports.zoomOut = {
    keyframes: [
        {
            opacity: 1,
            transform: 'none',
            'transform-origin': 'center middle'
        },
        {
            opacity: 0,
            transform: 'scale3d(.3, .3, .3)'
        },
        {
            opacity: 0,
            transform: 'none',
            'transform-origin': 'center middle'
        }
    ],
    timings: {
        duration: 1000,
        easing: 'elegantSlowStartEnd'
    },
    name: 'zoomOut'
};
