/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.duration', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('is as long as the latest keyframe', async () => {
    const { just } = await cy.window();
    const t1 = just.timeline().tween('target', 2000, { x: 0 });
    expect(t1.duration).to.equal(2000);
  });

  it('is as long as the latest animation', async () => {
    const { just } = await cy.window();
    const mockAnimation = {
      duration: 900,
    };
    const t1 = just.timeline().add(mockAnimation, 100);
    expect(t1.duration).to.equal(1000);
  });
});
