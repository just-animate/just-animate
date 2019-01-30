/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.on()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('registers events', () => {
    let eventCount = 0;
    cy.window()
      .then(({ just }) => {
        new just.Timeline().on('pause', () => eventCount++).pause();

        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(eventCount).to.equal(1);
      });
  });
});
