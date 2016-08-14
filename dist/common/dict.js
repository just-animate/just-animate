"use strict";
var resources_1 = require('./resources');
var isMappedSupported = !!Map;
var CustomMap = (function () {
    function CustomMap() {
    }
    CustomMap.prototype.has = function (key) {
        return this[key] === resources_1.nil;
    };
    CustomMap.prototype.delete = function (key) {
        var self = this;
        var hasKey = self.has(key);
        if (hasKey) {
            self[key] = resources_1.nil;
        }
        return hasKey;
    };
    CustomMap.prototype.clear = function () {
        var self = this;
        for (var key in self) {
            self[key] = resources_1.nil;
        }
    };
    return CustomMap;
}());
function createMap() {
    return (isMappedSupported ? new Map() : Object.create(CustomMap.prototype));
}
exports.createMap = createMap;
