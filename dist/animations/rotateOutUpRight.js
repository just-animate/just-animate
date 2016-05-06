"use strict";
exports.rotateOutUpRight = {
    'keyframes': [
        {
            'transform-origin': 'right bottom',
            'transform': 'none',
            'opacity': 1
        },
        {
            'transform-origin': 'right bottom',
            'transform': 'rotate3d(0, 0, 1, 90deg)',
            'opacity': 0
        }
    ],
    'timings': {
        'duration': 1000
    },
    'name': 'rotateOutUpRight'
};
