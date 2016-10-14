"use strict";
function invalidArg(name) {
    return new Error("Bad: " + name);
}
exports.invalidArg = invalidArg;
function unsupported(msg) {
    return new Error("Unsupported: " + msg);
}
exports.unsupported = unsupported;
