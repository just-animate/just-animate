/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('animate', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  xit('tweens opacity', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {Array<HTMLElement>} */
    const els = [];
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        els.push(
          document.createElement('button'),
          document.createElement('button'),
          document.createElement('button')
        );
        els.forEach(el => document.body.appendChild(el));

        new just.Timeline({ playState: 'paused' })
          .staggerAnimate(els, 1500, 100, { width: '15px' })
          .seek(300);

        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(els[0].style.width).to.equal('3px');
        expect(els[1].style.width).to.equal('2px');
        expect(els[2].style.width).to.equal('1px');
      });
  });
});
