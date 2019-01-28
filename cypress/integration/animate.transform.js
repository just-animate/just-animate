/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('animate.transform', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('tweens matrix', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'matrix(3,2,2,3,2,2)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('matrix(2, 1, 1, 2, 1, 1)');
      });
  });

  it('tweens matrix3d', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, {
            transform: 'matrix3d(3,2,2,2,2,3,2,2,2,2,3,2,2,2,2,3)',
          })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal(
          'matrix3d(2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2)'
        );
      });
  });

  it('tweens rotate', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'rotate(360deg)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('rotate(180deg)');
      });
  });

  it('tweens rotateX', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'rotateX(360deg)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('rotateX(180deg)');
      });
  });

  it('tweens rotateY', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'rotateY(360deg)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('rotateY(180deg)');
      });
  });

  it('tweens rotateZ', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'rotateZ(360deg)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('rotateZ(180deg)');
      });
  });

  it('tweens scale(n)', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'scale(0)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('scale(0.5)');
      });
  });

  it('tweens scale(n,n)', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'scale(0, .2)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('scale(0.5, 0.6)');
      });
  });

  it('tweens scale3d()', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'scale3d(0,0,0)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('scale3d(0.5, 0.5, 0.5)');
      });
  });

  it('tweens translate(n)', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'translate(100px)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('translate(50px)');
      });
  });

  it('tweens translate(n,n)', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'translate(100px, 100px)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('translate(50px, 50px)');
      });
  });

  it('tweens translateX', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'translateX(100px)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('translateX(50px)');
      });
  });

  it('tweens translateY', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { transform: 'translateY(100px)' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('translateY(50px)');
      });
  });
});
