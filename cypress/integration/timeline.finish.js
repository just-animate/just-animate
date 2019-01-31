/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.finish()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('updates the playState', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const t1 = new just.Timeline().finish();
        expect(t1.playState).to.equal('finish');
      });
  });

  it('sets the currentTime to end', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {import("../../dist/types").ja.TimelineAnimation} */
    let t1;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        t1 = new just.Timeline()
          .delay(1000)
          .seek(1000)
          .finish();

        expect(t1.playState).to.equal('finish');
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(t1.currentTime).to.equal(1000);
        expect(t1.playState).to.equal('paused');
      });
  });

  it('sets the currentTime to start when backwards', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {import("../../dist/types").ja.TimelineAnimation} */
    let t1;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        t1 = new just.Timeline().delay(1000).seek(1000);

        t1.playbackRate = -1;
        t1.finish();

        expect(t1.playState).to.equal('finish');
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(t1.currentTime).to.equal(0);
        expect(t1.playState).to.equal('paused');
      });
  });

  it('triggers the finish event', () => {
    /** @type {typeof window.just} */
    let just;
    let eventCount = 0;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        new just.Timeline().on('finish', () => eventCount++).finish();
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(eventCount).to.equal(1);
      });
  });
});
