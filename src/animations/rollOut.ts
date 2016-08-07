export const rollOut: ja.IAnimationPreset = {
  keyframes: [
    {
      opacity: 1,
      transform: 'none'
    },
    {
      opacity: 0,
      transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)'
    }
  ],
  
    to: 1000
  ,
  name: 'rollOut'
};