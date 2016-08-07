export const flipOutY: ja.IAnimationPreset = {
  keyframes: [
    {
      offset: 0,
      transform: 'perspective(400px)',
      opacity: 1
    },
    {
      offset: 0.3,
      transform: 'perspective(400px) rotate3d(0, 1, 0, -15deg)',
      opacity: 1
    },
    {
      offset: 1,
      transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
      opacity: 0
    }
  ],
  
    to: 750
  ,
  name: 'flipOutY'
};