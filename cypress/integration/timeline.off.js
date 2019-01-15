/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.off()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('unregisters events', async () => {
    const { just } = await cy.window();

    let eventCount = 0;
    const cancelHandler = () => eventCount++;

    just
      .timeline()
      .on('cancel', cancelHandler)
      .off('cancel', cancelHandler)
      .cancel();

    await just.nextAnimationFrame();
    expect(eventCount).to.equal(0);
  });
});
