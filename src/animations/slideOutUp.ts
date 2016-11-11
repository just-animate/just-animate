export const slideOutUp: ja.AnimationMixin = {
    css: [
        {
            visibility: 'visible',
            transform: 'translate3d(0, 0, 0)'
        },
        {
            visibility: 'hidden',
            transform: 'translate3d(0, -100%, 0)'
        }
    ],

    to: '1s'
    ,
    name: 'slideOutUp'
};
