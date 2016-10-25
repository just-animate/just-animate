export const lightSpeedOut: ja.IAnimationMixin = {
    css: [
        {
            transform: 'none',
            opacity: 1
        },
        {
            transform: 'translate3d(100%, 0, 0) skewX(30deg)',
            opacity: 0
        }
    ],
    to: '1s',
    fill: 'both',
    easing: 'ease-in',
    name: 'lightSpeedOut'
};
