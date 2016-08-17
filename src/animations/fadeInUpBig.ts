export const fadeInUpBig: ja.IAnimationMixin = {
  css: [
    {
      opacity: 0,
      transform: 'translate3d(0, 2000px, 0)'
    },
    {
      opacity: 1,
      transform: 'none'
    }
  ],
  to: 1300,
    fill: 'both',
    easing: 'ease-out',
  name: 'fadeInUpBig'
};