/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.delay', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('extends the timeline from the current position', async () => {
    const { just } = await cy.window();
    const t1 = just.timeline().delay(100);
    expect(t1.duration).to.equal(100);
  });
});
