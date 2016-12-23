export const fadeOutUp: ja.AnimationMixin = {
    css: [
        {
            opacity: 1,
            transform: 'none'
        },
        {
            opacity: 0,
            transform: 'translate3d(0, -100%, 0)'
        }
    ],
    to: '1s',
    name: 'fadeOutUp'
};
