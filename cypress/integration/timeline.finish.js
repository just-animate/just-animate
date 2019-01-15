/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.finish()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('updates the playState', async () => {
    const { just } = await cy.window();
    const t1 = just.timeline().finish();
    expect(t1.playState).to.equal('finish');
  });

  it('sets the currentTime to end', async () => {
    const { just } = await cy.window();

    const t1 = await just
      .timeline()
      .delay(1000)
      .seek(1000)
      .finish();

    expect(t1.playState).to.equal('finish');
    await just.nextAnimationFrame();

    expect(t1.currentTime).to.equal(1000);
    expect(t1.playState).to.equal('idle');
  });

  it('sets the currentTime to start when backwards', async () => {
    const { just } = await cy.window();
    const t1 = just
      .timeline()
      .delay(1000)
      .seek(1000);

    t1.playbackRate = -1;
    t1.finish();

    expect(t1.playState).to.equal('finish');
    await just.nextAnimationFrame();

    expect(t1.currentTime).to.equal(0);
    expect(t1.playState).to.equal('idle');
  });

  it('triggers the finish event', async () => {
    const { just } = await cy.window();

    let eventCount = 0;
    just
      .timeline()
      .on('finish', () => eventCount++)
      .finish();
    await just.nextAnimationFrame();

    expect(eventCount).to.equal(1);
  });
});
