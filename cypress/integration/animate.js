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
        just
          .animate(el, 1000, { opacity: 0 })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.opacity).to.equal('0.5');
      });
  });

  it('tweens opacity with ease', () => {
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
          .animate(el, 1000, { opacity: 0, ease: 'repeat(2)' })
          .pause()
          .seek(250);
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
        just
          .animate(el, 1000, { color: '#00F' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.color).to.equal('rgb(0, 0, 180)');
      });
  });
});
