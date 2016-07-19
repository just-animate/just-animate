export const rotateInUpLeft: ja.IAnimationOptions = {
  keyframes: [
    {
      transformOrigin: 'left bottom',
      transform: 'rotate3d(0, 0, 1, 45deg)',
      opacity: 0
    },
    {
      transformOrigin: 'left bottom',
      transform: 'none',
      opacity: 1
    }
  ],
  timings: {
    duration: 1000
  },
  name: 'rotateInUpLeft'
};