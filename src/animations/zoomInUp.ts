export const zoomInUp: ja.IAnimationMixin = {
    css: [
        {
            offset: 0,
            opacity: 0,
            transform: 'scale3d(.1, .1, .1) translate3d(0, 1000px, 0)'
        },
        {
            offset: 0.6,
            opacity: 1,
            transform: 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)'
        },
        {
            offset: 1,
            opacity: 1,
            transform: 'none'
        }
    ],

    to: '1s',
    easing: 'elegantSlowStartEnd'
    ,
    name: 'zoomInUp'
};
