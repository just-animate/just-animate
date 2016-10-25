export const zoomIn: ja.IAnimationMixin = {
    css: [
        {
            opacity: 0,
            transform: 'scale3d(.3, .3, .3)'
        },
        {
            opacity: 1
        },
        {
            opacity: 1,
            transform: 'none'
        }
    ],

    to: '1s',
    easing: 'elegantSlowStartEnd'
    ,
    name: 'zoomIn'
};
