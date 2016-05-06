"use strict";
exports.bounceInRight = {
    'keyframes': [
        {
            'offset': 0,
            'opacity': 0,
            'transform': 'translate3d(3000px, 0, 0)'
        },
        {
            'offset': 0.6,
            'opacity': 1,
            'transform': 'translate3d(-25px, 0, 0)'
        },
        {
            'offset': 0.75,
            'transform': 'translate3d(10px, 0, 0)'
        },
        {
            'offset': 0.9,
            'transform': 'translate3d(-5px, 0, 0)'
        },
        {
            'offset': 1,
            'opacity': 1,
            'transform': 'none'
        }
    ],
    'timings': {
        'duration': 900,
        'fill': 'both',
        'easing': 'easeOutCubic'
    },
    'name': 'bounceInRight'
};
