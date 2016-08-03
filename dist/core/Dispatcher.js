"use strict";
var type_1 = require('../helpers/type');
var dispatcher = {
    _fn: undefined,
    trigger: function (eventName, args) {
        var listeners = this._fn[eventName];
        if (!listeners) {
            return;
        }
        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            listeners[i].apply(undefined, args);
        }
    },
    on: function (eventName, listener) {
        if (!type_1.isFunction(listener)) {
            throw 'invalid listener';
        }
        var listeners = this._fn[eventName];
        if (!listeners) {
            this._fn[eventName] = [listener];
            return;
        }
        if (listeners.indexOf(listener) !== -1) {
            return;
        }
        listeners.push(listener);
    },
    off: function (eventName, listener) {
        var listeners = this._fn[eventName];
        if (!listeners) {
            return false;
        }
        var indexOfListener = listeners.indexOf(listener);
        if (indexOfListener === -1) {
            return false;
        }
        listeners.splice(indexOfListener, 1);
        return true;
    }
};
function createDispatcher() {
    var self = Object.create(dispatcher);
    self._fn = {};
    return self;
}
exports.createDispatcher = createDispatcher;
