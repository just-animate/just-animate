var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var units = require('../../dist/common/units');
var parseUnit = units.parseUnit;
var createUnitResolver = units.createUnitResolver;

describe('units', function () {
    describe('parseUnit()', function () {
        it('returns undefined when passed undefined', function () {
            var result = units.parseUnit(undefined);
            assert.equal(undefined, result.unit);
            assert.equal(undefined, result.value);
        });

        it('returns undefined when passed null', function () {
            var result = units.parseUnit(null);
            assert.equal(undefined, result.unit);
            assert.equal(undefined, result.value);
        });

        it('returns undefined when passed ""', function () {
            var result = units.parseUnit("");
            assert.equal(undefined, result.unit);
            assert.equal(undefined, result.value);
        });

        it('returns 2.2px when passed 2.2', function () {
            var result = units.parseUnit(2.2);
            assert.equal(2.2, result.value);
            assert.equal(undefined, result.unit);
        });

        it('returns -2.2px when passed -2.2', function () {
            var result = units.parseUnit(-2.2);
            assert.equal(-2.2, result.value);
            assert.equal(undefined, result.unit);
        });

        it('returns 2.2em when passed "2.2em"', function () {
            var result = units.parseUnit("2.2em");
            assert.equal(2.2, result.value);
            assert.equal('em', result.unit);
        });

        it('returns -2.2em when passed "-2.2em"', function () {
            var result = units.parseUnit("-2.2em");
            assert.equal(-2.2, result.value);
            assert.equal('em', result.unit);
        });

        it('returns 2.2ex when passed "2.2ex"', function () {
            var result = units.parseUnit("2.2ex");
            assert.equal(2.2, result.value);
            assert.equal('ex', result.unit);
        });

        it('returns -2.2ex when passed "-2.2ex"', function () {
            var result = units.parseUnit("-2.2ex");
            assert.equal(-2.2, result.value);
            assert.equal('ex', result.unit);
        });

        it('returns 2.2ch when passed "2.2ch"', function () {
            var result = units.parseUnit("2.2ch");
            assert.equal(2.2, result.value);
            assert.equal('ch', result.unit);
        });

        it('returns -2.2ch when passed "-2.2ch"', function () {
            var result = units.parseUnit("-2.2ch");
            assert.equal(-2.2, result.value);
            assert.equal('ch', result.unit);
        });

        it('returns 2.2rem when passed "2.2rem"', function () {
            var result = units.parseUnit("2.2rem");
            assert.equal(2.2, result.value);
            assert.equal('rem', result.unit);
        });

        it('returns -2.2rem when passed "-2.2rem"', function () {
            var result = units.parseUnit("-2.2rem");
            assert.equal(-2.2, result.value);
            assert.equal('rem', result.unit);
        });

        it('returns 2.2vh when passed "2.2vh"', function () {
            var result = units.parseUnit("2.2vh");
            assert.equal(2.2, result.value);
            assert.equal('vh', result.unit);
        });

        it('returns -2.2vh when passed "-2.2vh"', function () {
            var result = units.parseUnit("-2.2vh");
            assert.equal(-2.2, result.value);
            assert.equal('vh', result.unit);
        });

        it('returns 2.2vw when passed "2.2vw"', function () {
            var result = units.parseUnit("2.2vw");
            assert.equal(2.2, result.value);
            assert.equal('vw', result.unit);
        });

        it('returns -2.2vw when passed "-2.2vw"', function () {
            var result = units.parseUnit("-2.2vw");
            assert.equal(-2.2, result.value);
            assert.equal('vw', result.unit);
        });

        it('returns 2.2px when passed "2.2px"', function () {
            var result = units.parseUnit("2.2px");
            assert.equal(2.2, result.value);
            assert.equal('px', result.unit);
        });

        it('returns -2.2px when passed "-2.2px"', function () {
            var result = units.parseUnit("-2.2px");
            assert.equal(-2.2, result.value);
            assert.equal('px', result.unit);
        });

        it('returns 2.2mm when passed "2.2mm"', function () {
            var result = units.parseUnit("2.2mm");
            assert.equal(2.2, result.value);
            assert.equal('mm', result.unit);
        });

        it('returns -2.2mm when passed "-2.2mm"', function () {
            var result = units.parseUnit("-2.2mm");
            assert.equal(-2.2, result.value);
            assert.equal('mm', result.unit);
        });

        it('returns 2.2q when passed "2.2q"', function () {
            var result = units.parseUnit("2.2q");
            assert.equal(2.2, result.value);
            assert.equal('q', result.unit);
        });

        it('returns -2.2q when passed "-2.2q"', function () {
            var result = units.parseUnit("-2.2q");
            assert.equal(-2.2, result.value);
            assert.equal('q', result.unit);
        });

        it('returns 2.2cm when passed "2.2cm"', function () {
            var result = units.parseUnit("2.2cm");
            assert.equal(2.2, result.value);
            assert.equal('cm', result.unit);
        });

        it('returns -2.2cm when passed "-2.2cm"', function () {
            var result = units.parseUnit("-2.2cm");
            assert.equal(-2.2, result.value);
            assert.equal('cm', result.unit);
        });

        it('returns 2.2in when passed "2.2in"', function () {
            var result = units.parseUnit("2.2in");
            assert.equal(2.2, result.value);
            assert.equal('in', result.unit);
        });

        it('returns -2.2in when passed "-2.2in"', function () {
            var result = units.parseUnit("-2.2in");
            assert.equal(-2.2, result.value);
            assert.equal('in', result.unit);
        });

        it('returns 2.2pt when passed "2.2pt"', function () {
            var result = units.parseUnit("2.2pt");
            assert.equal(2.2, result.value);
            assert.equal('pt', result.unit);
        });

        it('returns -2.2pt when passed "-2.2pt"', function () {
            var result = units.parseUnit("-2.2pt");
            assert.equal(-2.2, result.value);
            assert.equal('pt', result.unit);
        });

        it('returns 2.2pc when passed "2.2pc"', function () {
            var result = units.parseUnit("2.2pc");
            assert.equal(2.2, result.value);
            assert.equal('pc', result.unit);
        });

        it('returns -2.2pc when passed "-2.2pc"', function () {
            var result = units.parseUnit("-2.2pc");
            assert.equal(-2.2, result.value);
            assert.equal('pc', result.unit);
        });

        it('returns 2.2% when passed "2.2%"', function () {
            var result = units.parseUnit("2.2%");
            assert.equal(2.2, result.value);
            assert.equal('%', result.unit);
        });

        it('returns -2.2% when passed "-2.2%"', function () {
            var result = units.parseUnit("-2.2%");
            assert.equal(-2.2, result.value);
            assert.equal('%', result.unit);
        });

        it('returns 100% when passed "100%"', function () {
            var result = units.parseUnit("100%");
            assert.equal(100, result.value);
            assert.equal('%', result.unit);
        });

        it('returns -100% when passed -100', function () {
            var result = units.parseUnit(-100);
            assert.equal(-100, result.value);
            assert.equal(undefined, result.unit);
        });

        it('returns -100% when passed "-100"', function () {
            var result = units.parseUnit("-100");
            assert.equal(-100, result.value);
            assert.equal(undefined, result.unit);
        });

        it('returns -100% when passed "-100%"', function () {
            var result = units.parseUnit("-100%");
            assert.equal(-100, result.value);
            assert.equal('%', result.unit);
        });
    });

    describe('createUnitResolver()', function () {
        it('returns 1s when passed 1s', function () {
            var resolver = units.createUnitResolver('1s');
            expect({ unit: 's', value: 1 }).to.deep.equal(resolver(0));
            expect({ unit: 's', value: 1 }).to.deep.equal(resolver(1));
            expect({ unit: 's', value: 1 }).to.deep.equal(resolver(2));
        });

        it('returns x += 1.1 when passed += 1.1', function () {
            var resolver = units.createUnitResolver('+=1.1');
            assert.approximately(resolver(0).value, 1.1, 0.0001);
            assert.approximately(resolver(1).value, 2.2, 0.0001);
            assert.approximately(resolver(2).value, 3.3, 0.0001);
        });

        it('returns x -= 1.1 when passed -= 1.1', function () {
            var resolver = units.createUnitResolver('-=1.1');
            assert.approximately(resolver(0).value, -1.1, 0.0001);
            assert.approximately(resolver(1).value, -2.2, 0.0001);
            assert.approximately(resolver(2).value, -3.3, 0.0001);
            assert.approximately
        });

        it('returns x += 1 when passed +=1s', function () {
            var resolver = units.createUnitResolver('+=1s');
            expect({ unit: 's', value: 1 }).to.deep.equal(resolver(0));
            expect({ unit: 's', value: 2 }).to.deep.equal(resolver(1));
            expect({ unit: 's', value: 3 }).to.deep.equal(resolver(2));
        });

        it('returns x -= 1s when passed -=1s', function () {
            var resolver = units.createUnitResolver('-=1s');
            expect({ unit: 's', value: -1 }).to.deep.equal(resolver(0));
            expect({ unit: 's', value: -2 }).to.deep.equal(resolver(1));
            expect({ unit: 's', value: -3 }).to.deep.equal(resolver(2));
        });


        it('returns 100 when passed 0to1', function () {
            var resolver = units.createUnitResolver('0 to 1');
            var random1 = resolver(0).value;
            assert.isAbove(random1, -.000001);            
            assert.isBelow(random1, 1);
        });
        
        it('returns 100 to 200 when passed 100to200', function () {
            var resolver = units.createUnitResolver('+= 100 to 200');
            var random1 = resolver(0).value;
            assert.isAbove(random1, 99);            
            assert.isBelow(random1, 200);

            var random2 = resolver(1).value;
            assert.isAbove(random2, 199);            
            assert.isBelow(random2, 300);
        });

    })
});