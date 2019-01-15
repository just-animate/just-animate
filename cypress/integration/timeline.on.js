/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.on()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('registers events', async () => {
    const { just } = await cy.window();
    let eventCount = 0;

    just
      .timeline()
      .on('pause', () => eventCount++)
      .pause();

    await just.nextAnimationFrame();
    expect(eventCount).to.equal(1);
  });
});
