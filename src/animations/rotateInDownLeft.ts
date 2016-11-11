export const rotateInDownLeft: ja.AnimationMixin = {
    css: [
        {
            transformOrigin: 'left bottom',
            transform: 'rotate3d(0, 0, 1, -45deg)',
            opacity: 0
        },
        {
            transformOrigin: 'left bottom',
            transform: 'none',
            opacity: 1
        }
    ],

    to: '1s'
    ,
    name: 'rotateInDownLeft'
};
