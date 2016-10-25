export const flipInX: ja.IAnimationMixin = {
    css: [
        {
            offset: 0,
            transform: 'perspective(400px)',
            rotateX: '90deg',
            opacity: 0
        },
        {
            offset: 0.4,
            transform: 'perspective(400px)',
            rotateX: '20deg'
        },
        {
            offset: 0.6,
            transform: 'perspective(400px)',
            rotateX: '10deg',
            opacity: 1
        },
        {
            offset: 0.8,
            transform: 'perspective(400px)',
            rotateX: '-5deg',
        },
        {
            offset: 1,
            opacity: 1,
            transform: 'perspective(400px)'
        }
    ],

    to: '750ms'
    ,
    name: 'flipInX'
};
