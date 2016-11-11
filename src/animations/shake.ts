export const shake: ja.AnimationMixin = {
    css: [
        {
            transform: 'translate3d(0, 0, 0)'
        },
        {
            transform: 'translate3d(-10px, 0, 0)'
        },
        {
            transform: 'translate3d(10px, 0, 0)'
        },
        {
            transform: 'translate3d(-10px, 0, 0)'
        },
        {
            transform: 'translate3d(10px, 0, 0)'
        },
        {
            transform: 'translate3d(-10px, 0, 0)'
        },
        {
            transform: 'translate3d(10px, 0, 0)'
        },
        {
            transform: 'translate3d(-10px, 0, 0)'
        },
        {
            transform: 'translate3d(10px, 0, 0)'
        },
        {
            transform: 'translate3d(-10px, 0, 0)'
        },
        {
            transform: 'translate3d(0, 0, 0)'
        }
    ],

    to: '1s'
    ,
    name: 'shake'
};
