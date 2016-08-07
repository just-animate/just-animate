var assert = require('chai').assert;
var units = require('../../dist/helpers/units');

describe('units', function () {
    describe('fromDistance()', function () {
        it('returns undefined when passed undefined', function () {
            var result = units.fromDistance(undefined);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed null', function () {
            var result = units.fromDistance(null);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed ""', function () {
            var result = units.fromDistance("");
            assert.equal(undefined, result);
        });

        it('returns 2.2px when passed 2.2', function () {
            var result = units.fromDistance(2.2);
            assert.equal(2.2, result.value);
            assert.equal(units.px, result.unit);
        });

        it('returns -2.2px when passed -2.2', function () {
            var result = units.fromDistance(-2.2);
            assert.equal(-2.2, result.value);
            assert.equal(units.px, result.unit);
        });

        it('returns 2.2em when passed "2.2em"', function () {
            var result = units.fromDistance("2.2em");
            assert.equal(2.2, result.value);
            assert.equal(units.em, result.unit);
        });

        it('returns -2.2em when passed "-2.2em"', function () {
            var result = units.fromDistance("-2.2em");
            assert.equal(-2.2, result.value);
            assert.equal(units.em, result.unit);
        });

        it('returns 2.2ex when passed "2.2ex"', function () {
            var result = units.fromDistance("2.2ex");
            assert.equal(2.2, result.value);
            assert.equal(units.ex, result.unit);
        });

        it('returns -2.2ex when passed "-2.2ex"', function () {
            var result = units.fromDistance("-2.2ex");
            assert.equal(-2.2, result.value);
            assert.equal(units.ex, result.unit);
        });

        it('returns 2.2ch when passed "2.2ch"', function () {
            var result = units.fromDistance("2.2ch");
            assert.equal(2.2, result.value);
            assert.equal(units.ch, result.unit);
        });

        it('returns -2.2ch when passed "-2.2ch"', function () {
            var result = units.fromDistance("-2.2ch");
            assert.equal(-2.2, result.value);
            assert.equal(units.ch, result.unit);
        });

        it('returns 2.2rem when passed "2.2rem"', function () {
            var result = units.fromDistance("2.2rem");
            assert.equal(2.2, result.value);
            assert.equal(units.rem, result.unit);
        });

        it('returns -2.2rem when passed "-2.2rem"', function () {
            var result = units.fromDistance("-2.2rem");
            assert.equal(-2.2, result.value);
            assert.equal(units.rem, result.unit);
        });

        it('returns 2.2vh when passed "2.2vh"', function () {
            var result = units.fromDistance("2.2vh");
            assert.equal(2.2, result.value);
            assert.equal(units.vh, result.unit);
        });

        it('returns -2.2vh when passed "-2.2vh"', function () {
            var result = units.fromDistance("-2.2vh");
            assert.equal(-2.2, result.value);
            assert.equal(units.vh, result.unit);
        });

        it('returns 2.2vw when passed "2.2vw"', function () {
            var result = units.fromDistance("2.2vw");
            assert.equal(2.2, result.value);
            assert.equal(units.vw, result.unit);
        });

        it('returns -2.2vw when passed "-2.2vw"', function () {
            var result = units.fromDistance("-2.2vw");
            assert.equal(-2.2, result.value);
            assert.equal(units.vw, result.unit);
        });

        it('returns 2.2vmin when passed "2.2vmin"', function () {
            var result = units.fromDistance("2.2vmin");
            assert.equal(2.2, result.value);
            assert.equal(units.vmin, result.unit);
        });
        
        it('returns -2.2vmin when passed "-2.2vmin"', function () {
            var result = units.fromDistance("-2.2vmin");
            assert.equal(-2.2, result.value);
            assert.equal(units.vmin, result.unit);
        });

        it('returns 2.2vmax when passed "2.2vmax"', function () {
            var result = units.fromDistance("2.2vmax");
            assert.equal(2.2, result.value);
            assert.equal(units.vmax, result.unit);
        });

        it('returns -2.2vmax when passed "-2.2vmax"', function () {
            var result = units.fromDistance("-2.2vmax");
            assert.equal(-2.2, result.value);
            assert.equal(units.vmax, result.unit);
        });

        it('returns 2.2px when passed "2.2px"', function () {
            var result = units.fromDistance("2.2px");
            assert.equal(2.2, result.value);
            assert.equal(units.px, result.unit);
        });

        it('returns -2.2px when passed "-2.2px"', function () {
            var result = units.fromDistance("-2.2px");
            assert.equal(-2.2, result.value);
            assert.equal(units.px, result.unit);
        });

        it('returns 2.2mm when passed "2.2mm"', function () {
            var result = units.fromDistance("2.2mm");
            assert.equal(2.2, result.value);
            assert.equal(units.mm, result.unit);
        });

        it('returns -2.2mm when passed "-2.2mm"', function () {
            var result = units.fromDistance("-2.2mm");
            assert.equal(-2.2, result.value);
            assert.equal(units.mm, result.unit);
        });

        it('returns 2.2q when passed "2.2q"', function () {
            var result = units.fromDistance("2.2q");
            assert.equal(2.2, result.value);
            assert.equal(units.q, result.unit);
        });

        it('returns -2.2q when passed "-2.2q"', function () {
            var result = units.fromDistance("-2.2q");
            assert.equal(-2.2, result.value);
            assert.equal(units.q, result.unit);
        });

        it('returns 2.2cm when passed "2.2cm"', function () {
            var result = units.fromDistance("2.2cm");
            assert.equal(2.2, result.value);
            assert.equal(units.cm, result.unit);
        });

        it('returns -2.2cm when passed "-2.2cm"', function () {
            var result = units.fromDistance("-2.2cm");
            assert.equal(-2.2, result.value);
            assert.equal(units.cm, result.unit);
        });

        it('returns 2.2in when passed "2.2in"', function () {
            var result = units.fromDistance("2.2in");
            assert.equal(2.2, result.value);
            assert.equal(units.inch, result.unit);
        });

        it('returns -2.2in when passed "-2.2in"', function () {
            var result = units.fromDistance("-2.2in");
            assert.equal(-2.2, result.value);
            assert.equal(units.inch, result.unit);
        });
        
        it('returns 2.2pt when passed "2.2pt"', function () {
            var result = units.fromDistance("2.2pt");
            assert.equal(2.2, result.value);
            assert.equal(units.point, result.unit);
        });

        it('returns -2.2pt when passed "-2.2pt"', function () {
            var result = units.fromDistance("-2.2pt");
            assert.equal(-2.2, result.value);
            assert.equal(units.point, result.unit);
        });

        it('returns 2.2pc when passed "2.2pc"', function () {
            var result = units.fromDistance("2.2pc");
            assert.equal(2.2, result.value);
            assert.equal(units.pica, result.unit);
        });

        it('returns -2.2pc when passed "-2.2pc"', function () {
            var result = units.fromDistance("-2.2pc");
            assert.equal(-2.2, result.value);
            assert.equal(units.pica, result.unit);
        });

        it('returns 2.2% when passed "2.2%"', function () {
            var result = units.fromDistance("2.2%");
            assert.equal(2.2, result.value);
            assert.equal(units.percent, result.unit);
        });
        
        it('returns -2.2% when passed "-2.2%"', function () {
            var result = units.fromDistance("-2.2%");
            assert.equal(-2.2, result.value);
            assert.equal(units.percent, result.unit);
        });
    });

    describe('fromPercentage()', function () {
        it('returns undefined when passed undefined', function () {
            var result = units.fromPercentage(undefined);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed null', function () {
            var result = units.fromPercentage(null);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed ""', function () {
            var result = units.fromPercentage("");
            assert.equal(undefined, result);
        });

        it('returns 2.2% when passed 2.2', function () {
            var result = units.fromPercentage(2.2);
            assert.equal(2.2, result.value);
        });

        it('returns -2.2% when passed -2.2', function () {
            var result = units.fromPercentage(-2.2);
            assert.equal(-2.2, result.value);
        });

        it('returns -2.2% when passed "-2.2%"', function () {
            var result = units.fromPercentage("-2.2%");
            assert.equal(-2.2, result.value);
        });

        it('returns 100% when passed 100', function () {
            var result = units.fromPercentage(100);
            assert.equal(100, result.value);
        });

        it('returns 100% when passed "100"', function () {
            var result = units.fromPercentage("100");
            assert.equal(100, result.value);
        });

        it('returns 100% when passed "100%"', function () {
            var result = units.fromPercentage("100%");
            assert.equal(100, result.value);
        });

        it('returns -100% when passed -100', function () {
            var result = units.fromPercentage(-100);
            assert.equal(-100, result.value);
        });

        it('returns -100% when passed "-100"', function () {
            var result = units.fromPercentage("-100");
            assert.equal(-100, result.value);
        });

        it('returns -100% when passed "-100%"', function () {
            var result = units.fromPercentage("-100%");
            assert.equal(-100, result.value);
        });
    });

    describe('fromTime()', function () {
        it('returns =0 when passed 0', function () {
            var result = units.fromTime(0);
            assert.equal(0, result.value);
            assert.equal(units.stepNone, result.step);
        });

        it('returns =2 when passed "2"', function () {
            var result = units.fromTime('2');
            assert.equal(2, result.value);
            assert.equal(units.stepNone, result.step);
        });

        it('returns =1 when passed 1ms', function () {
            var result = units.fromTime('1ms');
            assert.equal(1, result.value);
            assert.equal(units.stepNone, result.step);
        });

        it('returns +=1 when passed +=1ms', function () {
            var result = units.fromTime('+=1ms');
            assert.equal(1, result.value);
            assert.equal(units.stepForward, result.step);
        });

        it('returns -=1 when passed -=1ms', function () {
            var result = units.fromTime('-=1ms');
            assert.equal(1, result.value);
            assert.equal(units.stepBackward, result.step);
        });

        it('returns =1000 when passed 1s', function () {
            var result = units.fromTime('1s');
            assert.equal(1000, result.value);
            assert.equal(units.stepNone, result.step);
        });

        it('returns +=1000 when passed +=1s', function () {
            var result = units.fromTime('+=1s');
            assert.equal(1000, result.value);
            assert.equal(units.stepForward, result.step);
        });

        it('returns -=1000 when passed -=1s', function () {
            var result = units.fromTime('-=1s');
            assert.equal(1000, result.value);
            assert.equal(units.stepBackward, result.step);
        });
    });
});