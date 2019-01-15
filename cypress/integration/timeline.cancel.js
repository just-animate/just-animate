/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.cancel()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('sets currentTime and playState', async () => {
    const { just } = await cy.window();
    const t1 = just
      .timeline()
      .delay(100)
      .finish()
      .cancel();

    expect(t1.playState).to.equal('cancel');
  });

  it('triggers the cancel event', async () => {
    const { just } = await cy.window();
    let eventCount = 0;

    just
      .timeline()
      .on('cancel', () => eventCount++)
      .cancel();
    await just.nextAnimationFrame();

    expect(eventCount).to.equal(1);
  });
});
