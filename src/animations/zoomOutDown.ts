export const zoomOutDown = {
  'keyframes': [
    {
      'offset': 0,
      'opacity': 1,
      'transform': 'none',
      'transform-origin': 'center bottom'
    },
    {
      'offset': 0.4,
      'opacity': 1,
      'transform': 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)',
      'transform-origin': 'center bottom'
    },
    {
      'offset': 1,
      'opacity': 0,
      'transform': 'scale3d(.1, .1, .1) translate3d(0, 2000px, 0)',
      'transform-origin': 'center bottom'
    }
  ],
  'timings': {
    'duration': 1000,
    'easing': 'elegantSlowStartEnd'
  },
  'name': 'zoomOutDown'
};