export const fadeOut: ja.IAnimationOptions = {
  keyframes: [
    {
      opacity: 1
    },
    {
      opacity: 0
    }
  ],
  timings: {
    duration: 650,
    fill: 'both'
  },
  name: 'fadeOut'
};