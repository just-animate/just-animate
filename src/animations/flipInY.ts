export const flipInY: ja.IAnimationMixin = {
    css: [
        {
            offset: 0,
            transform: 'perspective(400px)',
            rotateY: '90deg',
            opacity: 0
        },
        {
            offset: 0.4,
            transform: 'perspective(400px)',
            rotateY: '-20deg',
        },
        {
            offset: 0.6,
            transform: 'perspective(400px)',
            rotateY: '10deg',
            opacity: 1
        },
        {
            offset: 0.8,
            transform: 'perspective(400px)',
            rotateY: '-5deg',
        },
        {
            offset: 1,
            transform: 'perspective(400px)',
            opacity: 1
        }
    ],

    to: 750
    ,
    name: 'flipInY'
};
