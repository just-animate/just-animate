/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('mixers', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('mixes <angle>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        debugger;
        new just.Timeline({ playState: 'paused' })
          .set(target, { width: '0deg' })
          .animate(target, 1000, { width: '100deg' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('50deg');
      });
  });

  it('mixes <integer>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { x: 0 })
          .animate(target, 1000, { x: 100 })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.x).to.equal(50);
      });
  });

  it('mixes <flex>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { width: '1fr' })
          .animate(target, 1000, { width: '2fr' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('1.5fr');
      });
  });

  it('mixes <gradient>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { background: 'linear-gradient(#000, #FFF)' })
          .animate(target, 1000, {
            background: 'linear-gradient(#FFFFFF, #000000)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.background).to.equal(
          'linear-gradient(rgba(180,180,180,1), rgba(180,180,180,1))'
        );
      });
  });

  it('mixes <length>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { width: '0px' })
          .animate(target, 1000, { width: '100px' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('50px');
      });
  });

  it('mixes <number>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { opacity: 0 })
          .animate(target, 1000, { opacity: 1 })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.opacity).to.closeTo(0.5, 0.0001);
      });
  });

  it('mixes <percentage>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { width: '0%' })
          .animate(target, 1000, { width: '100%' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('50%');
      });
  });

  it('mixes <ratio>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { minWidth: '10/4' })
          .animate(target, 1000, { minWidth: '2/2' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.minWidth).to.equal('6/3');
      });
  });

  it('mixes <timing-function>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { easeFn: 'cubic-bezier(0,0,1,1)' })
          .animate(target, 1000, { easeFn: 'cubic-bezier(1,1,0,0)' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.easeFn).to.equal('cubic-bezier(0.5,0.5,0.5,0.5)');
      });
  });

  it('mixes <transform-function>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, {
            transform: 'translateX(20px) scale(1.2) rotate(20deg)',
          })
          .animate(target, 1000, {
            transform: 'translate(120px) scale(.8) rotateZ(-120deg)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.transform).to.equal(
          'translate(70px) scale(1) rotateZ(-50deg)'
        );
      });
  });

  it('mixes hex colors', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, { color: '#000 #000000' })
          .animate(target, 1000, { color: '#FFF #FFFFFF' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.color).to.equal(
          'rgba(180,180,180,1) rgba(180,180,180,1)'
        );
      });
  });

  it('mixes rgb()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, {
            color: 'rgb(255,255,255)',
          })
          .animate(target, 1000, {
            color: 'rgb(0,0,0)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.color).to.equal('rgba(180,180,180,1)');
      });
  });

  it('mixes rgba()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, {
            color: 'rgb(255,255,255)',
          })
          .animate(target, 1000, {
            color: 'rgb(0,0,0)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.color).to.equal('rgba(180,180,180,1)');
      });
  });

  it('mixes hsl()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, {
            color: 'hsl(0, 50%, 50%)',
          })
          .animate(target, 1000, {
            color: 'hsl(360, 100%, 100%)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.color).to.equal('hsl(180, 75%, 75%)');
      });
  });

  it('mixes hsla()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, {
            color: 'hsla(0, 50%, 50%, 0.5)',
          })
          .animate(target, 1000, {
            color: 'hsla(360, 100%, 100%, 0)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.color).to.equal('hsla(180, 75%, 75%, 0.25)');
      });
  });

  it('mixes path data', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, {
            d: 'M0,0 C0,0 0,0 0,0z',
          })
          .animate(target, 1000, {
            d: 'M0,0 C100,100 100,100 100,100z',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.d).to.equal('M0,0 C50,50 50,50 50,50z');
      });
  });

  it('mixes path data', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline({ playState: 'paused' })
          .set(target, {
            d: 'M0 0 C 0 0 0 0 0 0z',
          })
          .animate(target, 1000, {
            d: 'M0 0 C 100 100 100 100 100 100z',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.d).to.equal('M0 0 C 50 50 50 50 50 50z');
      });
  });
});
