/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.set()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('has a basic usage', () => {
    cy.window().then(({ just }) => {
      const state = new just.Timeline()
        .set('target', { opacity: 0 })
        .getConfig();

      expect(state.keyframes.target, 'target').to.exist;
      expect(state.keyframes.target.opacity, 'opacity').to.exist;
      expect(state.keyframes.target.opacity[0], '[0]').to.exist;
      expect(state.keyframes.target.opacity[0].value, 'value').equal(0);
      expect(state.keyframes.target.opacity[0].$ease, '$ease').equal(
        'steps(1,end)'
      );
    });
  });
});
