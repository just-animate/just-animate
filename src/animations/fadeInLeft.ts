export const fadeInLeft: ja.IAnimationMixin = {
  keyframes: [
    {
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)'
    },
    {
      opacity: 1,
      transform: 'none'
    }
  ],
  to: 650,
    fill: 'both',
    easing: 'ease-in',
  name: 'fadeInLeft'
};