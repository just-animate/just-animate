"use strict";
exports.bounce = {
    css: [
        {
            easing: 'easeOutCubic',
            offset: [0, .2, .53, .80, 1],
            transformOrigin: 'center bottom',
            y: 0
        },
        {
            easing: 'easeInQuint',
            offset: [.4, .43],
            y: '-30px'
        },
        {
            easing: 'easeInQuint',
            offset: .7,
            y: '-15px'
        },
        {
            offset: .9,
            y: '-4px'
        }
    ],
    fill: 'both',
    name: 'bounce',
    to: 1000
};
