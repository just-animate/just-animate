export const bounceInDown: ja.IAnimationOptions = {
  keyframes: [
    {
      offset: 0,
      opacity: 0,
      translate3d: ['0', '-3000px', '0']
    },
    {
      offset: 0.6,
      opacity: 1,
      translate3d: ['0', '25px', '0']
    },
    {
      offset: 0.75,
      opacity: 1,
      translate3d: ['0', '-10px', '0']
    },
    {
      offset: 0.9,
      opacity: 1,
      translate3d: ['0', '5px', '0']
    },
    {
      offset: 1,
      opacity: 1,
      transform: 'none'
    }
  ],
  timings: {
    duration: 900,
    fill: 'both',
    easing: 'easeOutCubic'
  },
  name: 'bounceInDown'
}