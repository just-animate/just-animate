export const bounceIn = {
  'keyframes': [
    {
      'opacity': 0,
      'transform': 'scale3d(.3, .3, .3)'
    },
    {
      'transform': 'scale3d(1.1, 1.1, 1.1)'
    },
    {
      'transform': 'scale3d(.9, .9, .9)'
    },
    {
      'opacity': 1,
      'transform': 'scale3d(1.03, 1.03, 1.03)'
    },
    {
      'transform': 'scale3d(.97, .97, .97)'
    },
    {
      'opacity': 1,
      'transform': 'scale3d(1, 1, 1)'
    }
  ],
  'timings': {
    'duration': 900,
    'fill': 'both',
    'easing': 'easeOutCubic'
  },
  'name': 'bounceIn'
}