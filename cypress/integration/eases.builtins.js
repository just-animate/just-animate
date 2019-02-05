/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('eases.builtins', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('power(in, 2)', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('power(in, 2)');
      expect(ease(0)).to.equal(0);
      expect(ease(0.25)).to.equal(0.0625);
      expect(ease(0.5)).to.equal(0.25);
      expect(ease(0.75)).to.equal(0.5625);
      expect(ease(1)).to.equal(1);
    });
  });

  it('power(out, 2)', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('power(out, 2)');
      expect(ease(0)).to.equal(0);
      expect(ease(0.25)).to.equal(0.4375);
      expect(ease(0.5)).to.equal(0.75);
      expect(ease(0.75)).to.equal(0.9375);
      expect(ease(1)).to.equal(1);
    });
  });

  it('repeat', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('repeat(2)');
      expect(ease(0)).to.equal(0);
      expect(ease(0.25)).to.equal(0.5);
      expect(ease(0.5)).to.equal(0);
      expect(ease(0.75)).to.equal(0.5);
      expect(ease(1)).to.equal(1);
    });
  });

  it('step-end', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('steps(1, end)');
      expect(ease(0)).to.equal(0);
      expect(ease(0.1)).to.equal(0);
      expect(ease(0.9)).to.equal(0);
      expect(ease(1)).to.equal(1);
    });
  });

  it('step-start', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('steps(1, start)');
      expect(ease(0)).to.equal(0);
      expect(ease(0.1)).to.equal(1);
      expect(ease(0.9)).to.equal(1);
      expect(ease(1)).to.equal(1);
    });
  });

  it('yoyo', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('yoyo(2)');
      expect(ease(0)).to.equal(0);
      expect(ease(0.25)).to.equal(0.5);
      expect(ease(0.5)).to.equal(1);
      expect(ease(0.75)).to.equal(0.5);
      expect(ease(1)).to.equal(0);
    });
  });
});
