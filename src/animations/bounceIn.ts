export const bounceIn: ja.AnimationMixin = {
    css: [
        {
            opacity: 0,
            scale: .3
        },
        {
            scale: 1.1
        },
        {
            scale: .9
        },
        {
            opacity: 1,
            scale: 1.03
        },
        {
            scale: .97
        },
        {
            opacity: 1,
            scale: 1
        }
    ],
    easing: 'easeOutCubic',    
    fill: 'both',    
    name: 'bounceIn',
    to: '1s'
};
