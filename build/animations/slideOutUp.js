"use strict";
exports.slideOutUp = {
    'keyframes': [
        {
            'visibility': 'visible',
            'transform': 'translate3d(0, 0, 0)'
        },
        {
            'visibility': 'hidden',
            'transform': 'translate3d(0, -100%, 0)'
        }
    ],
    'timings': {
        'duration': 1000
    },
    'name': 'slideOutUp'
};
