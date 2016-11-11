export const rotateOut: ja.AnimationMixin = {
    css: [
        {
            transformOrigin: 'center',
            transform: 'none',
            opacity: 1
        },
        {
            transformOrigin: 'center',
            transform: 'rotate3d(0, 0, 1, 200deg)',
            opacity: 0
        }
    ],

    to: '1s'
    ,
    name: 'rotateOut'
};
