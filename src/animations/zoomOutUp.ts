export const zoomOutUp: ja.AnimationMixin = {
    css: [
        {
            offset: 0,
            opacity: 1,
            transform: 'none',
            transformOrigin: 'center bottom'
        },
        {
            offset: 0.4,
            opacity: 1,
            transform: 'scale3d(.475, .475, .475) translate3d(0, 60px, 0)'
        },
        {
            offset: 1,
            opacity: 0,
            transform: 'scale3d(.1, .1, .1) translate3d(0, -2000px, 0)',
            transformOrigin: 'center bottom'
        }
    ],

    to: '1s',
    easing: 'elegantSlowStartEnd'
    ,
    name: 'zoomOutUp'
};
