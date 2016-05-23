export const bounceIn: ja.IAnimationOptions = {
  name: 'bounceIn',
  keyframes: [
    {
      opacity: 0,
      scale3d: .3
    },
    {
      scale3d: 1.1
    },
    {
      scale3d: .9
    },
    {
      opacity: 1,
      scale3d: 1.03
    },
    {
      scale3d: .97
    },
    {
      opacity: 1,
      scale3d: 1
    }
  ],
  timings: {
    duration: 900,
    fill: 'both',
    easing: 'easeOutCubic'
  }
};