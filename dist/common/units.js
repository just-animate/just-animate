"use strict";
var type_1 = require("./type");
var resources_1 = require("./resources");
var errors_1 = require("./errors");
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
function Unit() {
    var self = this instanceof Unit ? this : Object.create(Unit.prototype);
    return self;
}
exports.Unit = Unit;
Unit.prototype = {
    step: resources_1.nil,
    unit: resources_1.nil,
    value: resources_1.nil,
    values: function (value, unit, step) {
        var self = this;
        self.value = value;
        self.unit = unit;
        self.step = step;
        return self;
    },
    toString: function () {
        return String(this.value) + this.unit;
    }
};
var sharedUnit = Unit();
function fromDistance(val, unit) {
    if (!type_1.isDefined(val)) {
        return resources_1.nil;
    }
    var returnUnit = unit || Unit();
    if (type_1.isNumber(val)) {
        return returnUnit.values(Number(val), exports.px, exports.stepNone);
    }
    var match = resources_1.distanceExpression.exec(val);
    var unitType = match[2];
    var value = parseFloat(match[1]);
    return returnUnit.values(value, unitType, exports.stepNone);
}
exports.fromDistance = fromDistance;
function fromPercentage(val, unit) {
    if (!type_1.isDefined(val)) {
        return resources_1.nil;
    }
    var returnUnit = unit || Unit();
    if (type_1.isNumber(val)) {
        return returnUnit.values(Number(val), exports.percent, exports.stepNone);
    }
    var match = resources_1.percentageExpression.exec(val);
    var value = parseFloat(match[1]);
    return returnUnit.values(value, exports.percent, exports.stepNone);
}
exports.fromPercentage = fromPercentage;
function fromTime(val, unit) {
    var returnUnit = unit || Unit();
    if (type_1.isNumber(val)) {
        return returnUnit.values(Number(val), exports.millisecond, exports.stepNone);
    }
    var match = resources_1.timeExpression.exec(val);
    var step = match[1] || exports.stepNone;
    var unitType = match[3];
    var value = parseFloat(match[2]);
    var valueMs;
    if (unitType === resources_1.nil || unitType === exports.millisecond) {
        valueMs = value;
    }
    else if (unitType === exports.second) {
        valueMs = value * 1000;
    }
    else {
        throw errors_1.invalidArg('format');
    }
    return returnUnit.values(valueMs, exports.millisecond, step);
}
exports.fromTime = fromTime;
function resolveTimeExpression(val, index) {
    fromTime(val, sharedUnit);
    if (sharedUnit.step === exports.stepForward) {
        return sharedUnit.value * index;
    }
    if (sharedUnit.step === exports.stepBackward) {
        return sharedUnit.value * index * -1;
    }
    return sharedUnit.value;
}
exports.resolveTimeExpression = resolveTimeExpression;
