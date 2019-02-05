/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('pad', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('padEnd as a number acts an end delay', () => {
    /** @type {typeof window.just} */
    let just;
    const targets = [{ x: 0 }, { x: 0 }, { x: 0 }];
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .animate(targets, 1100, {
            x: 100,
            $padEnd: 100,
          })
          .seek(500)
          .pause();
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(targets[0].x).to.equal(50);
        expect(targets[1].x).to.equal(50);
        expect(targets[2].x).to.equal(50);
      });
  });

  it('padStart as a number acts a start delay', () => {
    /** @type {typeof window.just} */
    let just;
    const targets = [{ x: 0 }, { x: 0 }, { x: 0 }];
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .animate(targets, 1100, {
            x: 100,
            $padStart: 100,
          })
          .seek(600)
          .pause();
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(targets[0].x).to.equal(50);
        expect(targets[1].x).to.equal(50);
        expect(targets[2].x).to.equal(50);
      });
  });

  it('padStart with a stagger works', () => {
    /** @type {typeof window.just} */
    let just;
    const targets = [{ x: 0 }, { x: 0 }, { x: 0 }];
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .animate(targets, 1000, {
            x: 100,
            $padStart: {
              duration: 300,
              stagger: true,
            },
          })
          .seek(600)
          .pause();
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(targets[0].x).to.be.approximately(55.555, 0.001);
        expect(targets[1].x).to.be.approximately(50, 0.001);
        expect(targets[2].x).to.be.approximately(42.857, 0.001);
      });
  });

  it('padStart with a stagger easing works', () => {
    /** @type {typeof window.just} */
    let just;
    const targets = [{ x: 0 }, { x: 0 }, { x: 0 }];
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .animate(targets, 1000, {
            x: 100,
            $padStart: {
              duration: 300,
              stagger: 'power(in, 2)',
            },
          })
          .seek(600)
          .pause();
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(targets[0].x).to.be.approximately(58.62, 0.001);
        expect(targets[1].x).to.be.approximately(53.846, 0.001);
        expect(targets[2].x).to.be.approximately(42.857, 0.001);
      });
  });

  it('padStart with a stagger ms works', () => {
    /** @type {typeof window.just} */
    let just;
    const targets = [{ x: 0 }, { x: 0 }, { x: 0 }];
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        just
          .animate(targets, 1000, {
            x: 100,
            $padStart: {
              stagger: 200,
            },
          })
          .seek(600)
          .pause();
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(targets[0].x).to.be.approximately(50, 0.001);
        expect(targets[1].x).to.be.approximately(33.333, 0.001);
        expect(targets[2].x).to.be.approximately(0, 0.001);
      });
  });
});
