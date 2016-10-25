export const pulse: ja.IAnimationMixin = {
    css: [
        {
            transform: 'scale3d(1, 1, 1)'
        },
        {
            transform: 'scale3d(1.05, 1.05, 1.05)'
        },
        {
            transform: 'scale3d(1, 1, 1)'
        }
    ],

    to: '1s'
    ,
    name: 'pulse'
};
