export const bounce: ja.IAnimationMixin = {
  name: 'bounce',
  css: [
    {
      offset: 0,
      y: 0
    },
    {
      offset: 0.2,
      y: 0
    },
    {
      offset: 0.4,
      y: '30px'
    },
    {
      offset: 0.43,
      y: '-30px'
    },
    {
      offset: 0.53,
      y: 0
    },
    {
      offset: 0.7,
      y: '-15px'
    },
    {
      offset: 0.8,
      y: 0
    },
    {
      offset: 0.9,
      y: '-4px'
    },
    {
      offset: 1,
      y: 0
    }
  ],
  to: 900,
  easing: 'easeOutCubic',
  fill: 'both'
};
