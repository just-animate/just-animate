export const rotateInDownRight: ja.AnimationMixin = {
    css: [
        {
            transformOrigin: 'right bottom',
            transform: 'rotate3d(0, 0, 1, 45deg)',
            opacity: 0
        },
        {
            transformOrigin: 'right bottom',
            transform: 'none',
            opacity: 1
        }
    ],

    to: '1s'
    ,
    name: 'rotateInDownRight'
};
