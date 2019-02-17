/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('playbackRate', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('test a playback speed of 1', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    let startTime;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        let resolve;
        const promise = new Promise(r => {
          resolve = r;
        });
        startTime = performance.now();
        t1 = new just.Timeline({ playbackRate: 1 })
          .animate(target, 500, { x: 0 })
          .on('finish', resolve);
        return promise;
      })
      .then(() => {
        const totalTime = performance.now() - startTime;
        // The expected execution + initial delay and a 10% margin of error.
        // Just Animate will slow down with the browser rather than tearing.
        expect(totalTime).to.be.within(500, 750);
        expect(t1.currentTime).to.equal(500);
      });
  });

  it('test a playback speed of .5 (half-speed)', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    let startTime;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        let resolve;
        const promise = new Promise(r => {
          resolve = r;
        });
        startTime = performance.now();
        t1 = new just.Timeline({ playbackRate: 0.5 })
          .animate(target, 500, { x: 0 })
          .on('finish', resolve);
        return promise;
      })
      .then(() => {
        const totalTime = performance.now() - startTime;
        // The expected execution + a healthy margin of error.
        // Just Animate will slow down with the browser rather than tearing.
        expect(totalTime).to.be.within(1000, 1500);
        expect(t1.currentTime).to.equal(500);
      });
  });

  it('test a playback speed of 2 (double-speed)', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    let startTime;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        let resolve;
        const promise = new Promise(r => {
          resolve = r;
        });
        startTime = performance.now();
        t1 = new just.Timeline({ playbackRate: 2 })
          .animate(target, 500, { x: 0 })
          .on('finish', resolve);
        return promise;
      })
      .then(() => {
        const totalTime = performance.now() - startTime;
        // The expected execution + initial delay and a 10% margin of error.
        // Just Animate will slow down with the browser rather than tearing.
        expect(totalTime).to.be.within(250, 450);
        expect(t1.currentTime).to.equal(500);
      });
  });

  it('test a playback speed of -1', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    let startTime;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        let resolve;
        const promise = new Promise(r => {
          resolve = r;
        });
        startTime = performance.now();
        t1 = new just.Timeline({ playbackRate: -1 })
          .animate(target, 500, { x: 0 })
          .seek(500)
          .on('finish', resolve);
        return promise;
      })
      .then(() => {
        const totalTime = performance.now() - startTime;
        // The expected execution + initial delay and a 10% margin of error.
        // Just Animate will slow down with the browser rather than tearing.
        expect(totalTime).to.be.within(500, 750);
        expect(t1.currentTime).to.equal(0);
      });
  });
});
