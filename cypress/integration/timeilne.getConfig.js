/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.getConfig()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('has a basic usage', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline().getConfig();

        // Ensure initial timeline state is correct.
        expect(state.alternate, 'alternate').equal(false);
        expect(state.currentTime, 'currentTime').equal(0);
        expect(state.events, 'events').deep.equal([]);
        expect(state.iterations, 'iterations').equal(1);
        expect(state.keyframes, 'keyframes').deep.equal({});
        expect(state.labels, 'labels').deep.equal({});
        expect(state.playState, 'playState').equal('running');
        expect(state.playbackRate, 'playbackRate').equal(1);
      });
  });
});
