/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.config()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('sets alternate correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({ alternate: true })
          .getConfig();

        expect(state.alternate).to.equal(true);
      });
  });

  it('sets currentTime correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({ currentTime: 1 })
          .getConfig();

        expect(state.currentTime).to.equal(1);
      });
  });

  it('sets events correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({ events: ['cancel'] })
          .getConfig();

        expect(state.events).to.deep.equal(['cancel']);
      });
  });

  it('sets iterations correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({ iterations: 2 })
          .getConfig();

        expect(state.iterations).to.equal(2);
      });
  });

  it('sets keyframes correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({
            keyframes: {
              i: {
                x: {
                  0: { value: 0 },
                },
              },
            },
          })
          .getConfig();

        expect(state.keyframes.i.x[0].value).to.equal(0);
      });
  });

  it('sets labels correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({ labels: { start: 0 } })
          .getConfig();

        expect(state.labels.start).to.equal(0);
      });
  });

  it('sets playState correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({ playState: 'cancel' })
          .getConfig();

        expect(state.playState).to.equal('cancel');
      });
  });

  it('sets playbackRate correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({ playbackRate: 2 })
          .getConfig();

        expect(state.playbackRate).to.equal(2);
      });
  });

  it('sets targets correctly', () => {
    /** @type {typeof window.just} */
    let just;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        const state = new just.Timeline()
          .configure({
            targets: {
              '@target': 1,
            },
          })
          .getConfig();

        expect(state.targets['@target']).to.equal(1);
      });
  });
});
