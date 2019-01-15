/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.pause()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('sets the current playState', () => {
    cy.window().then(({ just }) => {
      const t1 = just.timeline().pause();
      expect(t1.playState).to.equal('paused');
    });
  });

  it('triggers the pause event', () => {
    let eventCount = 0;
    cy.window()
      .then(({ just }) => {
        just
          .timeline()
          .on('play', () => eventCount++)
          .play();

        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(eventCount).to.equal(1);
      });
  });
});
