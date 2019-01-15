/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.tween()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('has a basic usage', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .tween('target', 2000, { x: 1 })
      .getConfig();

    expect(state.keyframes.target, 'target').to.exist;
    expect(state.keyframes.target.x, 'x').to.exist;
    expect(state.keyframes.target.x[2000], '[2000]').to.exist;
    expect(state.keyframes.target.x[2000].value, 'value').equal(1);
    expect(state.keyframes.target.x[2000].ease, 'ease').equal('linear');
  });

  it('can configure multiple properties in each call', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .tween('target', 5, { x: 0, y: 0, ease: 'linear' })
      .tween('target', 5, { x: 1, y: 0, ease: 'easeIn' })
      .tween('target', 5, { x: 0, y: 1, ease: 'easeOut' })
      .tween('target', 5, { x: 1, y: 1, ease: 'easeInOut' })
      .getConfig();

    expect(state.keyframes.target.x[5].value, 'x 5 value').equal(0);
    expect(state.keyframes.target.x[5].ease, 'x 5 ease').equal('linear');
    expect(state.keyframes.target.x[10].value, 'x 10 value').equal(1);
    expect(state.keyframes.target.x[10].ease, 'x 10 ease').equal('easeIn');
    expect(state.keyframes.target.x[15].value, 'x 15 value').equal(0);
    expect(state.keyframes.target.x[15].ease, 'x 15 ease').equal('easeOut');
    expect(state.keyframes.target.x[20].value, 'x 20 value').equal(1);
    expect(state.keyframes.target.x[20].ease, 'x 20 ease').equal('easeInOut');

    expect(state.keyframes.target.y[5].value, 'y 5 value').equal(0);
    expect(state.keyframes.target.y[5].ease, 'y 5 ease').equal('linear');
    expect(state.keyframes.target.y[10].value, 'y 10 value').equal(0);
    expect(state.keyframes.target.y[10].ease, 'y 10 ease').equal('easeIn');
    expect(state.keyframes.target.y[15].value, 'y 15 value').equal(1);
    expect(state.keyframes.target.y[15].ease, 'y 15ease').equal('easeOut');
    expect(state.keyframes.target.y[20].value, 'y 20 value').equal(1);
    expect(state.keyframes.target.y[20].ease, 'y 20 ease').equal('easeInOut');
  });
});
