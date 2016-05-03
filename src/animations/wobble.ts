export const wobble = {
  'keyframes': [
    {
      'offset': 0,
      'transform': 'none'
    },
    {
      'offset': 0.15,
      'transform': 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)'
    },
    {
      'offset': 0.3,
      'transform': 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)'
    },
    {
      'offset': 0.45,
      'transform': 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)'
    },
    {
      'offset': 0.6,
      'transform': 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)'
    },
    {
      'offset': 0.75,
      'transform': 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)'
    },
    {
      'offset': 1,
      'transform': 'none'
    }
  ],
  'timings': {
    'duration': 1000
  },
  'name': 'wobble'
};