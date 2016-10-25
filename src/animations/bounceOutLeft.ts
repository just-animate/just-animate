export const bounceOutLeft: ja.IAnimationMixin = {
    css: [
        {
            offset: 0,
            opacity: 1,
            transform: 'none'
        },
        {
            offset: 0.2,
            opacity: 1,
            transform: 'translate3d(20px, 0, 0)'
        },
        {
            offset: 1,
            opacity: 0,
            transform: 'translate3d(-2000px, 0, 0)'
        }
    ],

    to: '1s',
    fill: 'both'
    ,
    name: 'bounceOutLeft'
};
