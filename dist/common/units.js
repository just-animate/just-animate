"use strict";
var type_1 = require("./type");
var resources_1 = require("./resources");
var random_1 = require("./random");
exports.stepNone = '=';
exports.stepForward = '+=';
exports.stepBackward = '-=';
exports.em = 'em';
exports.ex = 'ex';
exports.ch = 'ch';
exports.rem = 'rem';
exports.vh = 'vh';
exports.vw = 'vw';
exports.vmin = 'vmin';
exports.vmax = 'vmax';
exports.px = 'px';
exports.mm = 'mm';
exports.q = 'q';
exports.cm = 'cm';
exports.inch = 'in';
exports.point = 'pt';
exports.pica = 'pc';
exports.percent = '%';
exports.millisecond = 'ms';
exports.second = 's';
function createUnitResolver(val) {
    if (!type_1.isDefined(val)) {
        return function () { return resources_1.nil; };
    }
    if (type_1.isNumber(val)) {
        return function () { return val; };
    }
    var match = resources_1.unitExpression.exec(val);
    var stepTypeString = match[1];
    var startString = match[2];
    var toOperator = match[3];
    var endValueString = match[4];
    var unitTypeString = match[5];
    var startCo = startString ? parseFloat(startString) : resources_1.nil;
    var endCo = endValueString ? parseFloat(endValueString) : resources_1.nil;
    var sign = stepTypeString === exports.stepBackward ? -1 : 1;
    var isIndexed = !!stepTypeString;
    var isRange = toOperator === 'to';
    var isUnitLess = !type_1.isDefined(unitTypeString);
    return function (index) {
        var index2 = isIndexed && type_1.isDefined(index) ? index + 1 : 1;
        var value = isRange
            ? random_1.random(startCo * (index2) * sign, endCo * index2 * sign)
            : startCo * index2 * sign;
        return isUnitLess ? value : value + unitTypeString;
    };
}
exports.createUnitResolver = createUnitResolver;
function parseUnit(val, output) {
    output = output || {};
    if (!type_1.isDefined(val)) {
        output.unit = undefined;
        output.value = resources_1.nil;
    }
    else if (type_1.isNumber(val)) {
        output.unit = undefined;
        output.value = val;
    }
    else {
        var match = resources_1.measureExpression.exec(val);
        var startString = match[1];
        var unitTypeString = match[2];
        output.unit = unitTypeString || resources_1.nil;
        output.value = startString ? parseFloat(startString) : resources_1.nil;
    }
    return output;
}
exports.parseUnit = parseUnit;
