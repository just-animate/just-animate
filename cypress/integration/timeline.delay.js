/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.delay', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('extends the timeline from the current position', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const t1 = new just.Timeline().delay(100);
        expect(t1.duration).to.equal(100);
      });
  });
});
