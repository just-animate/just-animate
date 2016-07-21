"use strict";
var type_1 = require('../helpers/type');
var distanceExpression = /(-{0,1}[0-9.]+)%{0,1}/;
var Percentage = (function () {
    function Percentage(value) {
        this.value = value;
    }
    Percentage.from = function (val) {
        if (!type_1.isDefined(val)) {
            return undefined;
        }
        if (type_1.isNumber(val)) {
            return new Percentage(val);
        }
        var match = distanceExpression.exec(val);
        var value = parseFloat(match[1]);
        return new Percentage(value);
    };
    Percentage.prototype.toString = function () {
        return this.value + "%";
    };
    return Percentage;
}());
exports.Percentage = Percentage;
