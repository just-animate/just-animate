import * as chai from 'chai';
import { timeline } from '../../src/lib/timeline';
const { assert } = chai;

describe('subscriber', () => {
  it('animations for other targets added during play automatically take effect', done => {
    var t1 = timeline();
    var target1 = { x: 0 };
    var target2 = { x: 0 };

    t1.animate({
      targets: target1,
      duration: 500,
      easing: 'linear',
      props: {
        x: [0, 500]
      }
    });

    t1.on('finish', () => {
      assert.equal(t1.duration, 1000);
      t1.destroy();
      done();
    });

    t1.play();

    setTimeout(function() {
      t1.animate({
        targets: target2,
        duration: 500,
        easing: 'linear',
        props: {
          x: [0, 500]
        }
      });
    }, 250);
  });
});
