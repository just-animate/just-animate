/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('animate', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('tweens opacity', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just.animate(el, 1000, { opacity: 0 }).seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.opacity).to.equal('0.5');
      });
  });

  it('tweens color', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just.animate(el, 1000, { color: '#00F' }).seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.color).to.equal('rgb(0, 0, 180)');
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
        just.animate(el, 1000, { transform: 'translateX(100px)' }).seek(500);
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
        just.animate(el, 1000, { transform: 'translateY(100px)' }).seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('translateY(50px)');
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
        just.animate(el, 1000, { transform: 'rotateX(360deg)' }).seek(500);
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
        just.animate(el, 1000, { transform: 'rotateY(360deg)' }).seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('rotateY(180deg)');
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
        just.animate(el, 1000, { transform: 'rotate(360deg)' }).seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('rotate(180deg)');
      });
  });

  it('tweens scale()', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just.animate(el, 1000, { transform: 'scale(0, .2)' }).seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.transform).to.equal('scale(0.5, 0.6)');
      });
  });
});
