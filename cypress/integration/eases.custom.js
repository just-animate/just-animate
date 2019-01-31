/// <reference types="Cypress" />
/// <reference types="../../dist/types" />

context('eases.custom', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html');
  });

  it('unknown ease returns a linear function', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('?');
      expect(ease(0.5)).to.equal(0.5);
    });
  });

  it('linear returns a linear function', () => {
    cy.window().then(({ just }) => {
      const ease = just.getEase('linear');
      expect(ease(0.5)).to.equal(0.5);
    });
  });

  it('custom eases with no parenthesis are called properly', () => {
    cy.window().then(({ just }) => {
      just.eases['squared'] = () => {
        return o => o * o;
      };
      const ease = just.getEase('squared');
      expect(ease(2)).to.equal(4);
    });
  });

  it('custom eases with no args are called properly', () => {
    cy.window().then(({ just }) => {
      just.eases['squared'] = () => {
        return o => o * o;
      };
      const ease = just.getEase('squared()');
      expect(ease(2)).to.equal(4);
    });
  });

  it('custom eases with args work properly', () => {
    cy.window().then(({ just }) => {
      just.eases['one'] = type => {
        return o => {
          if (type === 'minus') {
            return o - 1;
          }
          return o + 1;
        };
      };
      const minusOne = just.getEase('one(minus)');
      const plusOne = just.getEase('one(plus)');
      expect(minusOne(2)).to.equal(1);
      expect(plusOne(2)).to.equal(3);
    });
  });

  it('custom eases with numbers work properly', () => {
    cy.window().then(({ just }) => {
      just.eases['fake-bezier'] = (p0, p1, p2, p3) => {
        return o => o * p0 + o * p1 + o * p2 + o * p3;
      };
      const ease = just.getEase('fake-bezier(1, 2, 3, 4)');
      expect(ease(2)).to.equal(20);
    });
  });

  it('chained easings work properly', () => {
    cy.window().then(({ just }) => {
      just.eases['add'] = n => {
        return o => o + +n;
      };
      just.eases['subtract'] = n => {
        return o => o - +n;
      };
      just.eases['multiply'] = n => {
        return o => o * +n;
      };
      just.eases['divide'] = n => {
        return o => o / +n;
      };
      const compositeEase = just.getEase(
        'add(3) subtract(2) multiply(28) divide(2)'
      );
      expect(compositeEase(2)).to.equal(42);
    });
  });
});
