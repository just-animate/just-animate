export const bounceInDown: ja.IAnimationPreset = {
  keyframes: [
    {
      offset: 0,
      opacity: 0,
      y: '-3000px'
    },
    {
      offset: 0.6,
      opacity: 1,
      y: '25px'
    },
    {
      offset: 0.75,
      opacity: 1,
      y: '-10px'
    },
    {
      offset: 0.9,
      opacity: 1,
      y: '5px'
    },
    {
      offset: 1,
      opacity: 1,
      transform: 'none'
    }
  ],
  to: 900,
  fill: 'both',
  easing: 'easeOutCubic',
  name: 'bounceInDown'
};
