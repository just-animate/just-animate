"use strict";
var type_1 = require('./type');
var resources_1 = require('./resources');
var errors_1 = require('./errors');
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
function fromDistance(val) {
    if (!type_1.isDefined(val)) {
        return resources_1.nil;
    }
    if (type_1.isNumber(val)) {
        return Unit(Number(val), exports.px, exports.stepNone);
    }
    var match = resources_1.distanceExpression.exec(val);
    var unit = match[2];
    var value = parseFloat(match[1]);
    return Unit(value, unit, exports.stepNone);
}
exports.fromDistance = fromDistance;
function fromPercentage(val) {
    if (!type_1.isDefined(val)) {
        return resources_1.nil;
    }
    if (type_1.isNumber(val)) {
        return Unit(Number(val), exports.percent, exports.stepNone);
    }
    var match = resources_1.percentageExpression.exec(val);
    var value = parseFloat(match[1]);
    return Unit(value, exports.percent, exports.stepNone);
}
exports.fromPercentage = fromPercentage;
function fromTime(val) {
    if (type_1.isNumber(val)) {
        return Unit(Number(val), exports.millisecond, exports.stepNone);
    }
    var match = resources_1.timeExpression.exec(val);
    var step = match[1] || exports.stepNone;
    var unit = match[3];
    var value = parseFloat(match[2]);
    var valueMs;
    if (unit === resources_1.nil || unit === exports.millisecond) {
        valueMs = value;
    }
    else if (unit === exports.second) {
        valueMs = value * 1000;
    }
    else {
        throw errors_1.invalidArg('format');
    }
    return Unit(valueMs, exports.millisecond, step);
}
exports.fromTime = fromTime;
function Unit(value, unit, step) {
    var self = this instanceof Unit ? this : Object.create(Unit.prototype);
    self.value = value;
    self.unit = unit;
    self.step = step;
    return self;
}
exports.Unit = Unit;
Unit.prototype = {
    step: resources_1.nil,
    unit: resources_1.nil,
    value: resources_1.nil,
    toString: function () {
        return String(this.value) + this.unit;
    }
};
