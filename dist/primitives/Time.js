"use strict";
var type_1 = require('../helpers/type');
var timeExpression = /([+-][=]){0,1}([\-]{0,1}[0-9]+[\.]{0,1}[0-9]*){1}(s|ms){0,1}/;
var Time = (function () {
    function Time(value, stagger) {
        this.value = value;
        this.stagger = stagger;
    }
    Time.from = function (val) {
        if (type_1.isNumber(val)) {
            return new Time(val, Time.STAGGER_NONE);
        }
        var match = timeExpression.exec(val);
        var operator = match[1] || '=';
        var unit = match[3];
        var value = parseFloat(match[2]);
        var valueMs;
        if (unit === undefined || unit === 'ms') {
            valueMs = value;
        }
        else if (unit === 's') {
            valueMs = value * 1000;
        }
        else {
            throw Error('bad time format');
        }
        var operatorEnum;
        switch (operator) {
            case '+=':
                operatorEnum = Time.STAGGER_INCREASE;
                break;
            case '-=':
                operatorEnum = Time.STAGGER_DECREASE;
                break;
            default:
                operatorEnum = Time.STAGGER_NONE;
                break;
        }
        return new Time(valueMs, operatorEnum);
    };
    Time.prototype.toString = function () {
        return String(this.value) + 'ms';
    };
    Time.STAGGER_NONE = 0;
    Time.STAGGER_INCREASE = 1;
    Time.STAGGER_DECREASE = -1;
    return Time;
}());
exports.Time = Time;
