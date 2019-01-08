/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

const FRAME_DURATION = 35;

context('tick', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('calls the function on the next frame', () => {
    cy.window().then(({ just }) => {
      let ticks = 0;
      just.tick(() => {
        ticks++;
      });

      // Wait for at least 2 frames.
      cy.wait(FRAME_DURATION).then(() => {
        expect(ticks).to.equal(1);
      });
    });
  });

  it('calls the function until a falsy value is returned', () => {
    cy.window().then(({ just }) => {
      let ticks = 3;
      just.tick(() => {
        return --ticks;
      });

      // Wait for at least 2 frames.
      cy.wait(FRAME_DURATION * 2).then(() => {
        expect(ticks).to.equal(0);
      });
    });
  });

  it('request animation frame correctly fires after each frame', () => {
    let just = null;
    let value = null;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        // Schedule a tick callback and make sure it hasn't fired yet.
        just.tick(() => {
          value = 1;
        });
        expect(value).to.equal(null);

        return just.nextAnimationFrame();
      })
      .then(() => {
        // Make sure the new value has been applied.
        expect(value).to.equal(1);

        // Schedule another tick callback and make sure it hasn't fired yet.
        just.tick(() => {
          value = 2;
        });
        expect(value).to.equal(1);

        return just.nextAnimationFrame();
      })
      .then(() => {
        // Make sure the new value has been applied.
        expect(value).to.equal(2);
      });
  });
});
