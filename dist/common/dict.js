"use strict";
var resources_1 = require('./resources');
var isMappedSupported = !!Map;
function createMap() {
    return (isMappedSupported ? new Map() : Object.create(resources_1.nada));
}
exports.createMap = createMap;
