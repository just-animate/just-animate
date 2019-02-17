/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.iterations', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('test two iterations', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        let resolve;
        const promise = new Promise(r => {
          resolve = r;
        });
        t1 = new just.Timeline({ iterations: 2 })
          .animate(target, 250, { x: 0 })
          .on('finish', resolve);
        return promise;
      })
      .then(() => {
        expect(t1.playState).to.equal('paused');
        expect(t1.currentTime).to.equal(500);
      });
  });

  it('test infinite iterations', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        t1 = new just.Timeline({ iterations: Infinity }).animate(target, 50, {
          x: 0,
        });
        return cy.wait(400);
      })
      .then(() => {
        expect(t1.playState).to.equal('running');
      });
  });
});
