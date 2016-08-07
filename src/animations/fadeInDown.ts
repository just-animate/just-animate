export const fadeInDown: ja.IAnimationPreset = {
  keyframes: [
    {
      opacity: 0,
      y: '-100%'
    },
    {
      opacity: 1,
      transform: 'none'
    }
  ],
  
    to: 650,
    fill: 'both'
  ,
  name: 'fadeInDown'
};