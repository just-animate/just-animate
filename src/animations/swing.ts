export const swing: ja.AnimationMixin = {
    css: [
        {
            transform: 'none'
        },
        {
            transform: 'rotate3d(0, 0, 1, 15deg)'
        },
        {
            transform: 'rotate3d(0, 0, 1, -10deg)'
        },
        {
            transform: 'rotate3d(0, 0, 1, 5deg)'
        },
        {
            transform: 'rotate3d(0, 0, 1, -5deg)'
        },
        {
            transform: 'rotate3d(0, 0, 1, 0deg)'
        }
    ],

    to: '1s'
    ,
    name: 'swing'
};
