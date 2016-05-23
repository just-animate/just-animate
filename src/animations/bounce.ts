export const bounce: ja.IAnimationOptions = {
  keyframes: [
    {
      offset: 0,
      translate3d: '0'
    },
    {
      offset: 0.2,
      translate3d: ['0', '0', '0']
    },
    {
      offset: 0.4,
      translate3d: ['0', '-30px', '0']
    },
    {
      offset: 0.43,
      translate3d: ['0', '-30px', '0']
    },
    {
      offset: 0.53,
      translate3d: ['0', '0', '0']
    },
    {
      offset: 0.7,
      translate3d: ['0', '-15px', '0']
    },
    {
      offset: 0.8,
      translate3d: ['0', '0', '0']
    },
    {
      offset: 0.9,
      translate3d: ['0', '-4px', '0']
    },
    {
      offset: 1,
      translate3d: ['0', '0', '0']
    }
  ],
  timings: {
    duration: 900,
    fill: 'both',
    easing: 'easeOutCubic'
  },
  name: 'bounce'
}