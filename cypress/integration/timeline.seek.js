/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.seek()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('has a basic usage', async () => {
    const { just } = await cy.window();

    const t1 = just
      .timeline()
      .delay(100)
      .seek(42);

    expect(t1.currentTime).to.equal(42);
    expect(t1.playState).to.equal('paused');
  });

  it('does not alter the playState if already running', async () => {
    const { just } = await cy.window();

    const t1 = just
      .timeline()
      .delay(100)
      .play()
      .seek(42);

    expect(t1.playState).to.equal('running');
  });
});
