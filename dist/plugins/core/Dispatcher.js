"use strict";
var type_1 = require("../../common/type");
var errors_1 = require("../../common/errors");
var resources_1 = require("../../common/resources");
function Dispatcher() {
    var self = this;
    self = self instanceof Dispatcher ? self : Object.create(Dispatcher.prototype);
    self._fn = {};
    return self;
}
exports.Dispatcher = Dispatcher;
Dispatcher.prototype = {
    _fn: resources_1.nil,
    trigger: function (eventName, args) {
        var listeners = this._fn[eventName];
        if (!listeners) {
            return;
        }
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            listener.apply(resources_1.nil, args);
        }
    },
    on: function (eventName, listener) {
        if (!type_1.isFunction(listener)) {
            throw errors_1.invalidArg('listener');
        }
        var fn = this._fn;
        var listeners = fn[eventName];
        if (!listeners) {
            fn[eventName] = [listener];
            return;
        }
        if (listeners.indexOf(listener) !== -1) {
            return;
        }
        listeners.push(listener);
    },
    off: function (eventName, listener) {
        var listeners = this._fn[eventName];
        if (listeners) {
            var indexOfListener = listeners.indexOf(listener);
            if (indexOfListener !== -1) {
                listeners.splice(indexOfListener, 1);
            }
        }
    }
};
