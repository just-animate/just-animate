export const bounceInLeft: ja.IAnimationMixin = {
    css: [
        {
            offset: 0,
            opacity: 0,
            transform: 'translate3d(-3000px, 0, 0)'
        },
        {
            offset: 0.6,
            opacity: 1,
            transform: 'translate3d(25px, 0, 0)'
        },
        {
            offset: 0.75,
            opacity: 1,
            transform: 'translate3d(-10px, 0, 0)'
        },
        {
            offset: 0.9,
            opacity: 1,
            transform: 'translate3d(5px, 0, 0)'
        },
        {
            offset: 1,
            opacity: 1,
            transform: 'none'
        }
    ],
    to: '1s',
    fill: 'both',
    easing: 'easeOutCubic'
    ,
    name: 'bounceInLeft'
};
