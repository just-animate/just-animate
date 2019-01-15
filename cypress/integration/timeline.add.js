/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.add()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('adds an animation as a child', async () => {
    const { just } = await cy.window();

    const animation = { duration: 1000 };
    const t1 = just.timeline().add(animation);
    expect(t1.duration).to.equal(1000);
  });
});
