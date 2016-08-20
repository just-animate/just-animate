export const fadeInDown: ja.IAnimationMixin = {
    css: [
        {
            opacity: 0,
            y: '-100%'
        },
        {
            opacity: 1,
            transform: 'none'
        }
    ],

    to: 650,
    fill: 'both'
    ,
    name: 'fadeInDown'
};
