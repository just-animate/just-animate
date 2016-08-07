export const fadeInUp: ja.IAnimationPreset = {
  keyframes: [
    {
      opacity: 0,
      transform: 'translate3d(0, 100%, 0)'
    },
    {
      opacity: 1,
      transform: 'none'
    }
  ],
  to: 650,
    fill: 'both',
    easing: 'ease-in',
  name: 'fadeInUp'
};