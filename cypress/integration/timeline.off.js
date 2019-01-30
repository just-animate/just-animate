/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.off()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('unregisters events', () => {
    let eventCount = 0;
    cy.window()
      .then(({ just }) => {
        const cancelHandler = () => eventCount++;

        new just.Timeline()
          .on('cancel', cancelHandler)
          .off('cancel', cancelHandler)
          .cancel();

        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(eventCount).to.equal(0);
      });
  });
});
