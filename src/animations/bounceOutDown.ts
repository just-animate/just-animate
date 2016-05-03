export const bounceOutDown = {
  'keyframes': [
    {
      'offset': 0,
      'opacity': 1,
      'transform': 'none'
    },
    {
      'offset': 0.2,
      'transform': 'translate3d(0, 10px, 0)'
    },
    {
      'offset': 0.4,
      'opacity': 1,
      'transform': 'translate3d(0, -20px, 0)'
    },
    {
      'offset': 0.45,
      'opacity': 1,
      'transform': 'translate3d(0, -20px, 0)'
    },
    {
      'offset': 1,
      'opacity': 0,
      'transform': 'translate3d(0, 2000px, 0)'
    }
  ],
  'timings': {
    'duration': 900,
    'fill': 'both'
  },
  'name': 'bounceOutDown'
};
