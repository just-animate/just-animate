var assert = require('chai').assert;
var Distance = require('../../dist/primitives/Distance').Distance;

describe('Distance', function () {
    describe('from()', function () {
        it('returns undefined when passed undefined', function () {
            var result = Distance.from(undefined);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed null', function () {
            var result = Distance.from(null);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed ""', function () {
            var result = Distance.from("");
            assert.equal(undefined, result);
        });

        it('returns 2.2px when passed 2.2', function () {
            var result = Distance.from(2.2);
            assert.equal(2.2, result.value);
            assert.equal(Distance.px, result.unit);
        });

        it('returns -2.2px when passed -2.2', function () {
            var result = Distance.from(-2.2);
            assert.equal(-2.2, result.value);
            assert.equal(Distance.px, result.unit);
        });

        it('returns 2.2em when passed "2.2em"', function () {
            var result = Distance.from("2.2em");
            assert.equal(2.2, result.value);
            assert.equal(Distance.em, result.unit);
        });

        it('returns -2.2em when passed "-2.2em"', function () {
            var result = Distance.from("-2.2em");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.em, result.unit);
        });

        it('returns 2.2ex when passed "2.2ex"', function () {
            var result = Distance.from("2.2ex");
            assert.equal(2.2, result.value);
            assert.equal(Distance.ex, result.unit);
        });

        it('returns -2.2ex when passed "-2.2ex"', function () {
            var result = Distance.from("-2.2ex");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.ex, result.unit);
        });

        it('returns 2.2ch when passed "2.2ch"', function () {
            var result = Distance.from("2.2ch");
            assert.equal(2.2, result.value);
            assert.equal(Distance.ch, result.unit);
        });

        it('returns -2.2ch when passed "-2.2ch"', function () {
            var result = Distance.from("-2.2ch");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.ch, result.unit);
        });

        it('returns 2.2rem when passed "2.2rem"', function () {
            var result = Distance.from("2.2rem");
            assert.equal(2.2, result.value);
            assert.equal(Distance.rem, result.unit);
        });

        it('returns -2.2rem when passed "-2.2rem"', function () {
            var result = Distance.from("-2.2rem");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.rem, result.unit);
        });

        it('returns 2.2vh when passed "2.2vh"', function () {
            var result = Distance.from("2.2vh");
            assert.equal(2.2, result.value);
            assert.equal(Distance.vh, result.unit);
        });

        it('returns -2.2vh when passed "-2.2vh"', function () {
            var result = Distance.from("-2.2vh");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.vh, result.unit);
        });

        it('returns 2.2vw when passed "2.2vw"', function () {
            var result = Distance.from("2.2vw");
            assert.equal(2.2, result.value);
            assert.equal(Distance.vw, result.unit);
        });

        it('returns -2.2vw when passed "-2.2vw"', function () {
            var result = Distance.from("-2.2vw");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.vw, result.unit);
        });

        it('returns 2.2vmin when passed "2.2vmin"', function () {
            var result = Distance.from("2.2vmin");
            assert.equal(2.2, result.value);
            assert.equal(Distance.vmin, result.unit);
        });
        
        it('returns -2.2vmin when passed "-2.2vmin"', function () {
            var result = Distance.from("-2.2vmin");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.vmin, result.unit);
        });

        it('returns 2.2vmax when passed "2.2vmax"', function () {
            var result = Distance.from("2.2vmax");
            assert.equal(2.2, result.value);
            assert.equal(Distance.vmax, result.unit);
        });

        it('returns -2.2vmax when passed "-2.2vmax"', function () {
            var result = Distance.from("-2.2vmax");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.vmax, result.unit);
        });

        it('returns 2.2px when passed "2.2px"', function () {
            var result = Distance.from("2.2px");
            assert.equal(2.2, result.value);
            assert.equal(Distance.px, result.unit);
        });

        it('returns -2.2px when passed "-2.2px"', function () {
            var result = Distance.from("-2.2px");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.px, result.unit);
        });

        it('returns 2.2mm when passed "2.2mm"', function () {
            var result = Distance.from("2.2mm");
            assert.equal(2.2, result.value);
            assert.equal(Distance.mm, result.unit);
        });

        it('returns -2.2mm when passed "-2.2mm"', function () {
            var result = Distance.from("-2.2mm");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.mm, result.unit);
        });

        it('returns 2.2q when passed "2.2q"', function () {
            var result = Distance.from("2.2q");
            assert.equal(2.2, result.value);
            assert.equal(Distance.q, result.unit);
        });

        it('returns -2.2q when passed "-2.2q"', function () {
            var result = Distance.from("-2.2q");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.q, result.unit);
        });

        it('returns 2.2cm when passed "2.2cm"', function () {
            var result = Distance.from("2.2cm");
            assert.equal(2.2, result.value);
            assert.equal(Distance.cm, result.unit);
        });

        it('returns -2.2cm when passed "-2.2cm"', function () {
            var result = Distance.from("-2.2cm");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.cm, result.unit);
        });

        it('returns 2.2in when passed "2.2in"', function () {
            var result = Distance.from("2.2in");
            assert.equal(2.2, result.value);
            assert.equal(Distance.inch, result.unit);
        });

        it('returns -2.2in when passed "-2.2in"', function () {
            var result = Distance.from("-2.2in");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.inch, result.unit);
        });
        
        it('returns 2.2pt when passed "2.2pt"', function () {
            var result = Distance.from("2.2pt");
            assert.equal(2.2, result.value);
            assert.equal(Distance.point, result.unit);
        });

        it('returns -2.2pt when passed "-2.2pt"', function () {
            var result = Distance.from("-2.2pt");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.point, result.unit);
        });

        it('returns 2.2pc when passed "2.2pc"', function () {
            var result = Distance.from("2.2pc");
            assert.equal(2.2, result.value);
            assert.equal(Distance.pica, result.unit);
        });

        it('returns -2.2pc when passed "-2.2pc"', function () {
            var result = Distance.from("-2.2pc");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.pica, result.unit);
        });

        it('returns 2.2% when passed "2.2%"', function () {
            var result = Distance.from("2.2%");
            assert.equal(2.2, result.value);
            assert.equal(Distance.percent, result.unit);
        });
        
        it('returns -2.2% when passed "-2.2%"', function () {
            var result = Distance.from("-2.2%");
            assert.equal(-2.2, result.value);
            assert.equal(Distance.percent, result.unit);
        });
    });
});