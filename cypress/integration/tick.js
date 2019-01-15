/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('tick', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('calls the function on the next frame', async () => {
    const { just } = await cy.window();
    let ticks = 0;
    just.tick(() => {
      ticks++;
    });

    // Wait for at least 2 frames.
    await just.nextAnimationFrame();
    expect(ticks).to.equal(1);
  });

  it('calls the function until a falsy value is returned', async () => {
    const { just } = await cy.window();
    let ticks = 3;
    just.tick(() => {
      return --ticks;
    });

    await just.nextAnimationFrame();
    expect(ticks).to.equal(2);

    await just.nextAnimationFrame();
    expect(ticks).to.equal(1);

    await just.nextAnimationFrame();
    expect(ticks).to.equal(0);
  });

  it('request animation frame correctly fires after each frame', async () => {
    const { just } = await cy.window();
    let value = 0;

    // Schedule a tick callback and make sure it hasn't fired yet.
    just.tick(() => {
      value = 1;
    });

    expect(value).to.equal(0);

    await just.nextAnimationFrame();
    expect(value).to.equal(1);

    // Schedule another tick callback and make sure it hasn't fired yet.
    just.tick(() => {
      value = 2;
    });

    expect(value).to.equal(1);

    await just.nextAnimationFrame();
    expect(value).to.equal(2);
  });
});
