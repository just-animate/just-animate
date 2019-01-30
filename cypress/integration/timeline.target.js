/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.target()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('has a basic usage', () => {
    cy.window().then(({ just }) => {
      const target = {};
      const state = new just.Timeline().target('@target', target).getConfig();

      expect(state.targets['@target']).to.equal(target);
    });
  });
});
