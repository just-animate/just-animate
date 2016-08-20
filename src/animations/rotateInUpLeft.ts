export const rotateInUpLeft: ja.IAnimationMixin = {
    css: [
        {
            transformOrigin: 'left bottom',
            transform: 'rotate3d(0, 0, 1, 45deg)',
            opacity: 0
        },
        {
            transformOrigin: 'left bottom',
            transform: 'none',
            opacity: 1
        }
    ],

    to: 1000
    ,
    name: 'rotateInUpLeft'
};
