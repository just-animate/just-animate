"use strict";
exports.flip = {
    css: [
        {
            offset: 0,
            transform: 'perspective(400px) rotate3d(0, 1, 0, -360deg)'
        },
        {
            offset: 0.4,
            transform: 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)'
        },
        {
            offset: 0.5,
            transform: 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)'
        },
        {
            offset: 0.8,
            transform: 'perspective(400px) scale3d(.95, .95, .95)'
        },
        {
            offset: 1,
            transform: 'perspective(400px)'
        }
    ],
    to: 1000,
    name: 'flip'
};
