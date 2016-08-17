"use strict";
exports.zoomIn = {
    css: [
        {
            opacity: 0,
            transform: 'scale3d(.3, .3, .3)'
        },
        {
            opacity: 1
        },
        {
            opacity: 1,
            transform: 'none'
        }
    ],
    to: 1000,
    easing: 'elegantSlowStartEnd',
    name: 'zoomIn'
};
