/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.cancel()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('sets currentTime and playState', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const t1 = new just.Timeline()
          .delay(100)
          .finish()
          .cancel();

        expect(t1.playState).to.equal('cancel');
      });
  });

  it('triggers the cancel event', () => {
    /** @type {typeof window.just} */
    let just;
    let eventCount = 0;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline().on('cancel', () => eventCount++).cancel();
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(eventCount).to.equal(1);
      });
  });
});
