/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.add()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('adds an animation as a child', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const animation = { duration: 1000 };
        const t1 = just.timeline().add(animation);
        expect(t1.duration).to.equal(1000);
      });
  });
});
