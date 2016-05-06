"use strict";
exports.bounceInUp = {
    'keyframes': [
        {
            'offset': 0,
            'opacity': 0,
            'transform': 'translate3d(0, 3000px, 0)'
        },
        {
            'offset': 0.6,
            'opacity': 1,
            'transform': 'translate3d(0, -20px, 0)'
        },
        {
            'offset': 0.75,
            'opacity': 1,
            'transform': 'translate3d(0, 10px, 0)'
        },
        {
            'offset': 0.9,
            'opacity': 1,
            'transform': 'translate3d(0, -5px, 0)'
        },
        {
            'offset': 1,
            'opacity': 1,
            'transform': 'translate3d(0, 0, 0)'
        }
    ],
    'timings': {
        'duration': 900,
        'fill': 'both',
        'easing': 'easeOutCubic'
    },
    'name': 'bounceInUp'
};
