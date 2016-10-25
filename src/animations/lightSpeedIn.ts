export const lightSpeedIn: ja.IAnimationMixin = {
    css: [
        {
            offset: 0,
            transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
            opacity: 0
        },
        {
            offset: 0.6,
            transform: 'skewX(20deg)',
            opacity: 1
        },
        {
            offset: 0.8,
            transform: 'skewX(-5deg)',
            opacity: 1
        },
        {
            offset: 1,
            transform: 'none',
            opacity: 1
        }
    ],
    to: '1s',
    fill: 'both',
    easing: 'ease-out',
    name: 'lightSpeedIn'
};
