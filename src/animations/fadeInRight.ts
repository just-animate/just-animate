export const fadeInRight: ja.IAnimationMixin = {
    css: [
        {
            opacity: 0,
            transform: 'translate3d(100%, 0, 0)'
        },
        {
            opacity: 1,
            transform: 'none'
        }
    ],
    to: 650,
    fill: 'both',
    easing: 'ease-in',
    name: 'fadeInRight'
};
