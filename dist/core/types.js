"use strict";
var utils_1 = require('./utils');
var matcher = /([+-][=]){0,1}([0-9]+[\.]{0,1}[0-9]*){1}(s|ms){0,1}/;
function toTime(val) {
    if (utils_1.isNumber(val)) {
        return {
            operator: '=',
            value: val
        };
    }
    var match = matcher.exec(val);
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
    return {
        operator: operator,
        value: valueMs
    };
}
exports.toTime = toTime;
