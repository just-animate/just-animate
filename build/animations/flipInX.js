"use strict";
exports.flipInX = {
    'keyframes': [
        {
            'offset': 0,
            'transform': 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
            'easing': 'ease-in ',
            'opacity': 0
        },
        {
            'offset': 0.4,
            'transform': 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
            'easing': 'ease-in '
        },
        {
            'offset': 0.6,
            'transform': 'perspective(400px) rotate3d(1, 0, 0, 10deg)',
            'opacity': 1
        },
        {
            'offset': 0.8,
            'transform': 'perspective(400px) rotate3d(1, 0, 0, -5deg)'
        },
        {
            'offset': 1,
            'opacity': 1,
            'transform': 'perspective(400px)'
        }
    ],
    'timings': {
        'duration': 750
    },
    'name': 'flipInX'
};
