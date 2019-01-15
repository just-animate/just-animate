/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline.config()', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('sets alternate correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({ alternate: true })
      .getConfig();

    expect(state.alternate).to.equal(true);
  });

  it('sets currentTime correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({ currentTime: 1 })
      .getConfig();

    expect(state.currentTime).to.equal(1);
  });

  it('sets events correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({ events: ['cancel'] })
      .getConfig();

    expect(state.events).to.deep.equal(['cancel']);
  });

  it('sets iterations correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({ iterations: 2 })
      .getConfig();

    expect(state.iterations).to.equal(2);
  });

  it('sets keyframes correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
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

  it('sets labels correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({ labels: { start: 0 } })
      .getConfig();

    expect(state.labels.start).to.equal(0);
  });

  it('sets playState correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({ playState: 'cancel' })
      .getConfig();

    expect(state.playState).to.equal('cancel');
  });

  it('sets playbackRate correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({ playbackRate: 2 })
      .getConfig();

    expect(state.playbackRate).to.equal(2);
  });

  it('sets targets correctly', async () => {
    const { just } = await cy.window();
    const state = just
      .timeline()
      .configure({
        targets: {
          '@target': 1,
        },
      })
      .getConfig();

    expect(state.targets['@target']).to.equal(1);
  });
});
