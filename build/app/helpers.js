var ostring = Object.prototype.toString;
var slice = Array.prototype.slice;
function noop() {
    // do nothing
}
exports.noop = noop;
function isArray(a) {
    return !isString(a) && isNumber(a.length);
}
exports.isArray = isArray;
function isFunction(a) {
    return ostring.call(a) === '[object Function]';
}
exports.isFunction = isFunction;
function isJQuery(a) {
    return isFunction(jQuery) && a instanceof jQuery;
}
exports.isJQuery = isJQuery;
function isNumber(a) {
    return typeof a === 'number';
}
exports.isNumber = isNumber;
function isString(a) {
    return typeof a === 'string';
}
exports.isString = isString;
function toArray(indexed) {
    return slice.call(indexed, 0);
}
exports.toArray = toArray;
function each(items, fn) {
    for (var i = 0, len = items.length; i < len; i++) {
        fn(items[i]);
    }
}
exports.each = each;
function map(items, fn) {
    var results = [];
    for (var i = 0, len = items.length; i < len; i++) {
        var result = fn(items[i]);
        if (result !== undefined) {
            results.push(result);
        }
    }
    return results;
}
exports.map = map;
function extend(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    for (var i = 1, len = arguments.length; i < len; i++) {
        var source = arguments[i];
        for (var propName in source) {
            if (source.hasOwnProperty(propName)) {
                target[propName] = source[propName];
            }
        }
    }
    return target;
}
exports.extend = extend;
function multiapply(targets, fnName, args, cb) {
    var errors = [];
    var results = [];
    for (var i = 0, len = targets.length; i < len; i++) {
        try {
            var target = targets[i];
            var result = void 0;
            if (fnName) {
                result = target[fnName].apply(target, args);
            }
            else {
                result = target.apply(undefined, args);
            }
            if (result !== undefined) {
                results.push(result);
            }
        }
        catch (err) {
            errors.push(err);
        }
    }
    if (isFunction(cb)) {
        cb(errors);
    }
    return results;
}
exports.multiapply = multiapply;
