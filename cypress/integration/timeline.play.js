/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.play()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('sets the current playState', () => {
    cy.window().then(({ just }) => {
      const t1 = new just.Timeline().play();
      expect(t1.playState).to.equal('running');
    });
  });

  it('triggers the play event', async () => {
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
