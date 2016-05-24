export const rollIn: ja.IAnimationOptions = {
  keyframes: [
    {
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)'
    },
    {
      opacity: 1,
      transform: 'none'
    }
  ],
  timings: {
    duration: 1000
  },
  name: 'rollIn'
};