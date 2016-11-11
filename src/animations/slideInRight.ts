export const slideInRight: ja.AnimationMixin = {
    css: [
        {
            transform: 'translate3d(100%, 0, 0)',
            visibility: 'hidden'
        },
        {
            transform: 'translate3d(0, 0, 0)',
            visibility: 'visible'
        }
    ],

    to: '1s'
    ,
    name: 'slideInRight'
};
