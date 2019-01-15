/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.pause()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('sets the current playState', async () => {
    const { just } = await cy.window();
    const t1 = just.timeline().pause();
    expect(t1.playState).to.equal('paused');
  });

  it('triggers the pause event', async () => {
    const { just } = await cy.window();

    let eventCount = 0;
    just
      .timeline()
      .on('play', () => eventCount++)
      .play();

    await just.nextAnimationFrame();
    expect(eventCount).to.equal(1);
  });
});
