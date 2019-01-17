/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.animate()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('has a basic usage', () => {
    cy.window().then(({ just }) => {
      const state = just
        .timeline()
        .animate('target', 2000, { x: 1 })
        .getConfig();

      expect(state.keyframes.target, 'target').to.exist;
      expect(state.keyframes.target.x, 'x').to.exist;
      expect(state.keyframes.target.x[2000], '[2000]').to.exist;
      expect(state.keyframes.target.x[2000].value, 'value').equal(1);
      expect(state.keyframes.target.x[2000].ease, 'ease').equal('linear');
    });
  });

  it('can configure multiple properties in each call', () => {
    cy.window().then(({ just }) => {
      const state = just
        .timeline()
        .animate('target', 5, { x: 0, y: 0, ease: 'linear' })
        .animate('target', 5, { x: 1, y: 0, ease: 'easeIn' })
        .animate('target', 5, { x: 0, y: 1, ease: 'easeOut' })
        .animate('target', 5, { x: 1, y: 1, ease: 'easeInOut' })
        .getConfig();

      expect(state.keyframes.target.x[5].value, 'x 5 value').equal(0);
      expect(state.keyframes.target.x[5].ease, 'x 5 ease').equal('linear');
      expect(state.keyframes.target.x[10].value, 'x 10 value').equal(1);
      expect(state.keyframes.target.x[10].ease, 'x 10 ease').equal('easeIn');
      expect(state.keyframes.target.x[15].value, 'x 15 value').equal(0);
      expect(state.keyframes.target.x[15].ease, 'x 15 ease').equal('easeOut');
      expect(state.keyframes.target.x[20].value, 'x 20 value').equal(1);
      expect(state.keyframes.target.x[20].ease, 'x 20 ease').equal('easeInOut');

      expect(state.keyframes.target.y[5].value, 'y 5 value').equal(0);
      expect(state.keyframes.target.y[5].ease, 'y 5 ease').equal('linear');
      expect(state.keyframes.target.y[10].value, 'y 10 value').equal(0);
      expect(state.keyframes.target.y[10].ease, 'y 10 ease').equal('easeIn');
      expect(state.keyframes.target.y[15].value, 'y 15 value').equal(1);
      expect(state.keyframes.target.y[15].ease, 'y 15ease').equal('easeOut');
      expect(state.keyframes.target.y[20].value, 'y 20 value').equal(1);
      expect(state.keyframes.target.y[20].ease, 'y 20 ease').equal('easeInOut');
    });
  });

  it('tweens <angle>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { width: '0deg' })
          .animate(target, 1000, { width: '100deg' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('50deg');
      });
  });

  it('tweens <integer>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { x: 0 })
          .animate(target, 1000, { x: 100 })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.x).to.equal(50);
      });
  });

  it('tweens <flex>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { width: '1fr' })
          .animate(target, 1000, { width: '2fr' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('1.5fr');
      });
  });

  it('tweens <gradient>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { background: 'linear-gradient(#000, #FFF)' })
          .animate(target, 1000, {
            background: 'linear-gradient(#FFFFFF, #000000)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.background).to.equal(
          'linear-gradient(rgb(180,180,180) ,rgb(180,180,180))'
        );
      });
  });

  it('tweens <length>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { width: '0px' })
          .animate(target, 1000, { width: '100px' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('50px');
      });
  });

  it('tweens <number>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { opacity: 0 })
          .animate(target, 1000, { opacity: 1 })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.opacity).to.closeTo(0.5, 0.0001);
      });
  });

  it('tweens <percentage>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { width: '0%' })
          .animate(target, 1000, { width: '100%' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.width).to.equal('50%');
      });
  });

  it('tweens <ratio>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { minWidth: '10/4' })
          .animate(target, 1000, { minWidth: '2/2' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.minWidth).to.equal('6/3');
      });
  });

  it('tweens <single-transition-timing-function>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { easeFn: 'cubic-bezier(0,0,1,1)' })
          .animate(target, 1000, { easeFn: 'cubic-bezier(1,1,0,0)' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.easeFn).to.equal('cubic-bezier(0.5,0.5,0.5,0.5)');
      });
  });

  it('tweens <timing-function>', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, {
            transform: 'translateX(20px) scale(1.2) rotateZ(20deg)',
          })
          .animate(target, 1000, {
            transform: 'translateX(120px) scale(.8) rotateZ(-120deg)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.transform).to.equal(
          'translateX(70px) scale(1) rotateZ(-50deg)'
        );
      });
  });

  it('tweens hex colors', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, { color: '#000 #000000' })
          .animate(target, 1000, { color: '#FFF #FFFFFF' })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.color).to.equal('rgb(180,180,180) rgb(180,180,180)');
      });
  });

  it('tweens rgb()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
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
        expect(target.color).to.equal('rgb(180,180,180)');
      });
  });

  it('tweens rgba()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
          .set(target, {
            color: 'rgb(255,255,255,.5)',
          })
          .animate(target, 1000, {
            color: 'rgb(0,0,0, 1)',
          })
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(target.color).to.equal('rgb(180,180,180,0.75)');
      });
  });

  it('tweens hsl()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
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
        expect(target.color).to.equal('hsl(180,75%,75%)');
      });
  });

  it('tweens hsla()', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
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
        expect(target.color).to.equal('hsla(180,75%,75%,0.25)');
      });
  });

  it('tweens path data', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
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
        expect(target.d).to.equal('M 0,0C 50,50 50,50 50,50z');
      });
  });

  it('tweens path data', () => {
    /** @type {typeof window.just} */
    let just;
    const target = {};
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .timeline()
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
        expect(target.d).to.equal('M 0 0C 50 50 50 50 50 50z');
      });
  });
});
