/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('animate', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('tweens opacity', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { opacity: 0 })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.opacity).to.equal('0.5');
      });
  });

  it('tweens opacity with $ease', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { opacity: 0, $ease: 'repeat(2)' })
          .pause()
          .seek(250);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.opacity).to.equal('0.5');
      });
  });

  it('tweens color', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement} */
    let el;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        just
          .animate(el, 1000, { color: '#00F' })
          .pause()
          .seek(500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(el.style.color).to.equal('rgb(0, 0, 180)');
      });
  });

  it('staggers objects properly', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {{}[]} */
    let targets;
    let t1;
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        targets = [{ x: 0 }, { x: 0 }, { x: 0 }];
        t1 = just
          .animate(targets, 1000, { x: 10, $stagger: 100 })
          .pause()
          .seek(400);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(t1.duration).to.equal(1300);
        expect(targets[0].x).to.equal(3);
        expect(targets[1].x).to.equal(2);
        expect(targets[2].x).to.equal(1);
      });
  });

  it('staggers selectors properly', () => {
    /** @type {typeof window.just} */
    let just;
    /** @type {HTMLElement[]} */
    let targets;
    let t1;
    cy.window()
      .then(win => {
        just = win.just;
        return win;
      })
      .then(win => {
        targets = [
          win.document.createElement('button'),
          win.document.createElement('button'),
          win.document.createElement('button'),
        ];
        targets.forEach(el => win.document.body.appendChild(el));

        t1 = just
          .animate('button', 1000, { width: '100px', $stagger: 100 })
          .set('button', { width: 0, $from: 0 }) // Override initial button size.
          .pause()
          .seek(400);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(t1.duration).to.equal(1300);
        expect(targets[0].style.width).to.equal('30px');
        expect(targets[1].style.width).to.equal('20px');
        expect(targets[2].style.width).to.equal('10px');
      });
  });

  it('delays properly', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        t1 = just
          .animate(target, 1000, { x: 100, $delay: 1000 })
          .pause()
          .seek(1500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(t1.duration).to.equal(2000);
        expect(target.x).to.equal(50);
      });
  });

  it('endDelays properly', () => {
    /** @type {typeof window.just} */
    let just;
    let t1;
    const target = { x: 0 };
    cy.window()
      .then(win => (just = win.just))
      .then(() => {
        t1 = just
          .animate(target, 1000, { x: 100, $endDelay: 1000 })
          .pause()
          .seek(1500);
        return just.nextAnimationFrame();
      })
      .then(() => {
        expect(t1.duration).to.equal(2000);
        expect(target.x).to.equal(100);
      });
  });
});
