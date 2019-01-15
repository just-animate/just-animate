/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('tick', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('calls the function on the next frame', () => {
    /** @type {typeof window.just} */
    let just;
    let ticks = 0;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just.tick(() => {
          ticks++;
        });
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(ticks).to.equal(1);
      });
  });

  it('calls the function until a falsy value is returned', () => {
    /** @type {typeof window.just} */
    let just;
    let ticks = 3;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just.tick(() => {
          return --ticks;
        });
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(ticks).to.equal(2);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(ticks).to.equal(1);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(ticks).to.equal(0);
        return just.nextAnimationFrame();
      });
  });

  it('request animation frame correctly fires after each frame', async () => {
    /** @type {typeof window.just} */
    let just;
    let value = 0;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just.tick(() => {
          value = 1;
        });
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(value).to.equal(1);
        just.tick(() => {
          value = 2;
        });
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(value).to.equal(2);
      });
  });
});
