export const fadeOutDown: ja.IAnimationMixin = {
    css: [
        {
            opacity: 1,
            transform: 'none'
        },
        {
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)'
        }
    ],

    to: 650
    ,
    name: 'fadeOutDown'
};
