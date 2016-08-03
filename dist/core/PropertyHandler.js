"use strict";
var propertyHandlerPrototype = {
    addPropertyHandler: function () {
    }
};
function createPropertyHandler() {
    var self = Object.create(propertyHandlerPrototype);
    // TODO: initialization
    return self;
}
exports.createPropertyHandler = createPropertyHandler;
