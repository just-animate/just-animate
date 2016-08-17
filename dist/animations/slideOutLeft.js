"use strict";
exports.slideOutLeft = {
    css: [
        {
            visibility: 'visible',
            transform: 'translate3d(0, 0, 0)'
        },
        {
            visibility: 'hidden',
            transform: 'translate3d(-100%, 0, 0)'
        }
    ],
    to: 1000,
    name: 'slideOutLeft'
};
