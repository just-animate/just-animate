"use strict";
var type_1 = require('../helpers/type');
var distanceExpression = /(-{0,1}[0-9.]+)(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|q|cm|in|pt|pc|\%){0,1}/;
var Distance = (function () {
    function Distance(value, unit) {
        this.value = value;
        this.unit = unit;
    }
    Distance.from = function (val) {
        if (!type_1.isDefined(val)) {
            return undefined;
        }
        if (type_1.isNumber(val)) {
            return new Distance(val, Distance.px);
        }
        var match = distanceExpression.exec(val);
        var unit = match[2];
        var value = parseFloat(match[1]);
        return new Distance(value, unit);
    };
    Distance.prototype.toString = function () {
        return "" + this.value + this.unit;
    };
    Distance.em = 'em';
    Distance.ex = 'ex';
    Distance.ch = 'ch';
    Distance.rem = 'rem';
    Distance.vh = 'vh';
    Distance.vw = 'vw';
    Distance.vmin = 'vmin';
    Distance.vmax = 'vmax';
    Distance.px = 'px';
    Distance.mm = 'mm';
    Distance.q = 'q';
    Distance.cm = 'cm';
    Distance.inch = 'in';
    Distance.point = 'pt';
    Distance.pica = 'pc';
    Distance.percent = '%';
    return Distance;
}());
exports.Distance = Distance;
