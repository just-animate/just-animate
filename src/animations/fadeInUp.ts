export const fadeInUp: ja.AnimationMixin = {
    css: [
        {
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)'
        },
        {
            opacity: 1,
            transform: 'none'
        }
    ],
    to: '1s',
    fill: 'both',
    easing: 'ease-in',
    name: 'fadeInUp'
};
