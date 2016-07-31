"use strict";
var type_1 = require('../helpers/type');
var Dispatcher = (function () {
    function Dispatcher() {
        this._listeners = {};
    }
    Dispatcher.prototype.trigger = function (eventName, args) {
        var listeners = this._listeners[eventName];
        if (!listeners) {
            return;
        }
        var len = listeners.length;
        for (var i = 0; i < len; i++) {
            listeners[i].apply(undefined, args);
        }
    };
    Dispatcher.prototype.on = function (eventName, listener) {
        if (!type_1.isFunction(listener)) {
            throw 'invalid listener';
        }
        var listeners = this._listeners[eventName];
        if (!listeners) {
            this._listeners[eventName] = [listener];
            return;
        }
        if (listeners.indexOf(listener) !== -1) {
            return;
        }
        listeners.push(listener);
    };
    Dispatcher.prototype.off = function (eventName, listener) {
        var listeners = this._listeners[eventName];
        if (!listeners) {
            return false;
        }
        var indexOfListener = listeners.indexOf(listener);
        if (indexOfListener === -1) {
            return false;
        }
        listeners.splice(indexOfListener, 1);
        return true;
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
