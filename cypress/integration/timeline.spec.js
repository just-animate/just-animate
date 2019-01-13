/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('timeline', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  context('add', () => {
    it('adds an animation as a child', () => {
      cy.window().then(({ just }) => {
        const animation = { duration: 1000 };
        const t1 = just.timeline().add(animation);
        expect(t1.duration).to.equal(1000);
      });
    });
  });

  context('cancel', () => {
    it('sets currentTime and playState', () => {
      cy.window().then(({ just }) => {
        const t1 = just
          .timeline()
          .delay(100)
          .finish()
          .cancel();

        expect(t1.playState).to.equal('idle');
        expect(t1.currentTime).to.equal(0);
      });
    });

    xit('triggers the cancel event', () => {
      cy.window().then(({ just }) => {
        let eventCount = 0;
        just
          .timeline()
          .on('cancel', () => eventCount++)
          .play();

        expect(eventCount).to.equal(1);
      });
    });
  });

  context('delay', () => {
    it('extends the timeline from the current position', () => {
      cy.window().then(({ just }) => {
        const t1 = just.timeline().delay(100);
        expect(t1.duration).to.equal(100);
      });
    });
  });

  context('duration', () => {
    it('is as long as the latest keyframe', () => {
      cy.window().then(({ just }) => {
        const t1 = just.timeline().tween('target', 2000, { x: 0 });
        expect(t1.duration).to.equal(2000);
      });
    });

    it('is as long as the latest animation', () => {
      cy.window().then(({ just }) => {
        const mockAnimation = {
          duration: 900,
        };
        const t1 = just.timeline().add(mockAnimation, 100);
        expect(t1.duration).to.equal(1000);
      });
    });
  });

  context('finish', () => {
    it('updates the playState', () => {
      cy.window().then(({ just }) => {
        const t1 = just.timeline().finish();
        expect(t1.playState).to.equal('paused');
      });
    });

    it('sets the currentTime to end', () => {
      cy.window().then(({ just }) => {
        const t1 = just
          .timeline()
          .delay(1000)
          .finish();

        expect(t1.currentTime).to.equal(1000);
      });
    });

    it('sets the currentTime to start when backwards', () => {
      cy.window().then(({ just }) => {
        const t1 = just
          .timeline()
          .delay(1000)
          .seek(1000);

        t1.playbackRate = -1;
        t1.finish();

        expect(t1.currentTime).to.equal(0);
      });
    });

    xit('triggers the finish event', () => {
      cy.window().then(({ just }) => {
        let eventCount = 0;
        const t1 = just
          .timeline()
          .on('finish', () => eventCount++)
          .finish();

        expect(eventCount).to.equal(1);
      });
    });
  });

  context('getActiveDuration', () => {
    it('has an initial value', () => {
      cy.window().then(({ just }) => {
        const t1 = just.timeline();
        expect(t1.getActiveDuration()).to.equal(0);
      });
    });

    it('calculates based on the number of iterations', () => {
      cy.window().then(({ just }) => {
        const t1 = just.timeline().tween('target', 1000, { x: 0 });
        t1.iterations = 2;
        expect(t1.getActiveDuration()).to.equal(2000);
      });
    });
  });

  context('getConfig', () => {
    it('has a basic usage', () => {
      cy.window().then(({ just }) => {
        const state = just.timeline().getConfig();

        // Ensure initial timeline state is correct.
        expect(state.alternate, 'alternate').equal(false);
        expect(state.currentTime, 'currentTime').equal(0);
        expect(state.events, 'events').deep.equal([]);
        expect(state.iterations, 'iterations').equal(1);
        expect(state.keyframes, 'keyframes').deep.equal({});
        expect(state.labels, 'labels').deep.equal({});
        expect(state.playState, 'playState').equal('idle');
        expect(state.playbackRate, 'playbackRate').equal(1);
        expect(state.targets, 'targets').deep.equal({});
      });
    });
  });

  context('label', () => {
    it('automatically set at current duration', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .delay(100)
          .label('mid')
          .label(100)
          .getConfig();

        expect(state.labels.mid).to.equal(100);
      });
    });

    it('can be set to a particular time', () => {
      cy.window().then(({ just }) => {
        const target = {};
        const state = just
          .timeline()
          .delay(100)
          .label('start', 0)
          .label(100)
          .getConfig();

        expect(state.labels.start).to.equal(0);
      });
    });
  });

  context('off', () => {
    xit('unregisters events', () => {
      cy.window().then(({ just }) => {
        let eventCount = 0;
        const cancelHandler = () => eventCount++;

        just
          .timeline()
          .on('cancel', cancelHandler)
          .off('cancel', cancelHandler)
          .cancel();

        expect(eventCount).to.equal(0);
      });
    });
  });

  context('on', () => {
    xit('registers events', () => {
      cy.window().then(({ just }) => {
        let eventCount = 0;
        just
          .timeline()
          .on('cancel', () => eventCount++)
          .on('finish', () => eventCount++)
          .on('play', () => eventCount++)
          .on('pause', () => eventCount++)
          .cancel()
          .finish()
          .play()
          .pause();

        expect(eventCount).to.equal(4);
      });
    });
  });

  context('pause', () => {
    it('sets the current playState', () => {
      cy.window().then(({ just }) => {
        const t1 = just.timeline().pause();
        expect(t1.playState).to.equal('paused');
      });
    });

    xit('triggers the pause event', () => {
      cy.window().then(({ just }) => {
        let eventCount = 0;
        just
          .timeline()
          .on('pause', () => eventCount++)
          .play();

        expect(eventCount).to.equal(1);
      });
    });
  });

  context('play', () => {
    it('sets the current playState', () => {
      cy.window().then(({ just }) => {
        const t1 = just.timeline().play();
        expect(t1.playState).to.equal('running');
      });
    });

    xit('triggers the play event', () => {
      cy.window().then(({ just }) => {
        let eventCount = 0;
        just
          .timeline()
          .on('play', () => eventCount++)
          .play();

        expect(eventCount).to.equal(1);
      });
    });
  });

  context('seek', () => {
    it('has a basic usage', () => {
      cy.window().then(({ just }) => {
        const t1 = just
          .timeline()
          .delay(100)
          .seek(42);

        expect(t1.currentTime).to.equal(42);
        expect(t1.playState).to.equal('paused');
      });
    });

    it('does not alter the playState if already running', () => {
      cy.window().then(({ just }) => {
        const t1 = just
          .timeline()
          .delay(100)
          .play()
          .seek(42);

        expect(t1.playState).to.equal('running');
      });
    });
  });

  context('set', () => {
    it('has a basic usage', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .set('target', { opacity: 0 })
          .getConfig();

        expect(state.keyframes.target, 'target').to.exist;
        expect(state.keyframes.target.opacity, 'opacity').to.exist;
        expect(state.keyframes.target.opacity[0], '[0]').to.exist;
        expect(state.keyframes.target.opacity[0].value, 'value').equal(0);
        expect(state.keyframes.target.opacity[0].ease, 'ease').equal(
          'steps(1,end)'
        );
      });
    });
  });

  context('config', () => {
    it('sets alternate correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({ alternate: true })
          .getConfig();

        expect(state.alternate).to.equal(true);
      });
    });

    it('sets currentTime correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({ currentTime: 1 })
          .getConfig();

        expect(state.currentTime).to.equal(1);
      });
    });

    it('sets events correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .configure({ events: ['cancel'] })
          .getConfig();

        expect(state.events).to.deep.equal(['cancel']);
      });
    });

    it('sets iterations correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({ iterations: 2 })
          .getConfig();

        expect(state.iterations).to.equal(2);
      });
    });

    it('sets keyframes correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({
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
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({ labels: { start: 0 } })
          .getConfig();

        expect(state.labels.start).to.equal(0);
      });
    });

    it('sets playState correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({ playState: 'cancel' })
          .getConfig();

        expect(state.playState).to.equal('cancel');
      });
    });

    it('sets playbackRate correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({ playbackRate: 2 })
          .getConfig();

        expect(state.playbackRate).to.equal(2);
      });
    });

    it('sets targets correctly', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .config({
            targets: {
              '@target': 1,
            },
          })
          .getConfig();

        expect(state.targets['@target']).to.equal(1);
      });
    });
  });

  context('target', () => {
    it('has a basic usage', () => {
      cy.window().then(({ just }) => {
        const target = {};
        const state = just
          .timeline()
          .target('@target', target)
          .getConfig();

        expect(state.targets['@target']).to.equal(target);
      });
    });
  });

  context('tween', () => {
    it('has a basic usage', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .tween('target', 2000, { x: 1 })
          .getConfig();

        expect(state.keyframes.target, 'target').to.exist;
        expect(state.keyframes.target.x, 'x').to.exist;
        expect(state.keyframes.target.x[2000], '[2000]').to.exist;
        expect(state.keyframes.target.x[2000].value, 'value').equal(1);
        expect(state.keyframes.target.x[2000].ease, 'ease').equal('linear');
      });
    });

    it('can configure multiple properties in each call', () => {
      cy.window().then(({ just }) => {
        const state = just
          .timeline()
          .tween('target', 5, { x: 0, y: 0, ease: 'linear' })
          .tween('target', 5, { x: 1, y: 0, ease: 'easeIn' })
          .tween('target', 5, { x: 0, y: 1, ease: 'easeOut' })
          .tween('target', 5, { x: 1, y: 1, ease: 'easeInOut' })
          .getConfig();

        expect(state.keyframes.target.x[5].value, 'x 5 value').equal(0);
        expect(state.keyframes.target.x[5].ease, 'x 5 ease').equal('linear');
        expect(state.keyframes.target.x[10].value, 'x 10 value').equal(1);
        expect(state.keyframes.target.x[10].ease, 'x 10 ease').equal('easeIn');
        expect(state.keyframes.target.x[15].value, 'x 15 value').equal(0);
        expect(state.keyframes.target.x[15].ease, 'x 15 ease').equal('easeOut');
        expect(state.keyframes.target.x[20].value, 'x 20 value').equal(1);
        expect(state.keyframes.target.x[20].ease, 'x 20 ease').equal(
          'easeInOut'
        );

        expect(state.keyframes.target.y[5].value, 'y 5 value').equal(0);
        expect(state.keyframes.target.y[5].ease, 'y 5 ease').equal('linear');
        expect(state.keyframes.target.y[10].value, 'y 10 value').equal(0);
        expect(state.keyframes.target.y[10].ease, 'y 10 ease').equal('easeIn');
        expect(state.keyframes.target.y[15].value, 'y 15 value').equal(1);
        expect(state.keyframes.target.y[15].ease, 'y 15ease').equal('easeOut');
        expect(state.keyframes.target.y[20].value, 'y 20 value').equal(1);
        expect(state.keyframes.target.y[20].ease, 'y 20 ease').equal(
          'easeInOut'
        );
      });
    });
  });
});
