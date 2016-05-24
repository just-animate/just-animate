"use strict";
exports.headShake = {
    keyframes: [
        {
            offset: 0,
            translateX: '0'
        },
        {
            offset: 0.065,
            translateX: '-6px',
            rotateY: '-9deg'
        },
        {
            offset: 0.185,
            translateX: '5px',
            rotateY: '7deg'
        },
        {
            offset: 0.315,
            translateX: '-3px',
            rotateY: '-5deg'
        },
        {
            offset: 0.435,
            translateX: '2px',
            rotateY: '3deg'
        },
        {
            offset: 0.5,
            translateX: '0'
        },
        {
            offset: 1,
            translateX: '0'
        }
    ],
    timings: {
        duration: 1000,
        easing: 'ease-out'
    },
    name: 'headShake'
};
