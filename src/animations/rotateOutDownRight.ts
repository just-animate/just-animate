export const rotateOutDownRight: ja.IAnimationMixin = {
  keyframes: [
    {
      transformOrigin: 'right bottom',
      transform: 'none',
      opacity: 1
    },
    {
      transformOrigin: 'right bottom',
      transform: 'rotate3d(0, 0, 1, -45deg)',
      opacity: 0
    }
  ],
  
    to: 1000
  ,
  name: 'rotateOutDownRight'
};