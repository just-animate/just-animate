/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.playbackRate', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('test a playback speed of 1', () => {
    /** @type {typeof window.just} */
    let just;
    let end1, end2, end3;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const resolver1 = resolver();
        const resolver2 = resolver();
        const resolver3 = resolver();

        new just.Timeline({ playbackRate: 2 })
          .animate(target, 500, { x: 0 })
          .on('finish', () => {
            end1 = performance.now();
            resolver1.resolve();
          });

        new just.Timeline({ playbackRate: 1 })
          .animate(target, 500, { x: 0 })
          .on('finish', () => {
            end2 = performance.now();
            resolver2.resolve();
          });

        new just.Timeline({ playbackRate: 0.5 })
          .animate(target, 500, { x: 0 })
          .on('finish', () => {
            end3 = performance.now();
            resolver3.resolve();
          });
        return Promise.all([
          resolver1.promise,
          resolver2.promise,
          resolver3.promise,
        ]);
      })
      .then(() => {
        expect(end1).to.be.lessThan(end2);
        expect(end2).to.be.lessThan(end3);
      });
  });

  function resolver() {
    const promisable = {};
    promisable.promise = new Promise(r => {
      promisable.resolve = r;
    });
    return promisable;
  }
});
