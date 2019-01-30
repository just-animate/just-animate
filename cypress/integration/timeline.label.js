/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.label()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('automatically set at current duration', () => {
    cy.window().then(({ just }) => {
      const state = new just.Timeline()
        .delay(100)
        .label('mid')
        .label(100)
        .getConfig();

      expect(state.labels.mid).to.equal(100);
    });
  });

  it('can be set to a particular time', () => {
    cy.window().then(({ just }) => {
      const state = new just.Timeline()
        .delay(100)
        .label('start', 0)
        .label(100)
        .getConfig();

      expect(state.labels.start).to.equal(0);
    });
  });
});
