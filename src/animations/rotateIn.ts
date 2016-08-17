export const rotateIn: ja.IAnimationMixin = {
  css: [
    {
      transformOrigin: 'center',
      transform: 'rotate3d(0, 0, 1, -200deg)',
      opacity: 0
    },
    {
      transformOrigin: 'center',
      transform: 'none',
      opacity: 1
    }
  ],
  
    to: 1000
  ,
  name: 'rotateIn'
};