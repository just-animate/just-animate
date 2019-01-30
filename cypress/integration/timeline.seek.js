/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.seek()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('has a basic usage', () => {
    cy.window().then(({ just }) => {
      const t1 = new just.Timeline()
        .delay(100)
        .seek(42)
        .pause();

      expect(t1.currentTime).to.equal(42);
      expect(t1.playState).to.equal('paused');
    });
  });

  it('does not alter the playState if already running', () => {
    cy.window().then(({ just }) => {
      const t1 = new just.Timeline().delay(100).seek(42);

      expect(t1.playState).to.equal('running');
    });
  });
});
