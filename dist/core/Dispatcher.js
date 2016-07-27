"use strict";
var lists_1 = require('../helpers/lists');
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
        lists_1.each(listeners, function (l) { return l.apply(undefined, args); });
    };
    Dispatcher.prototype.on = function (eventName, listener) {
        if (!type_1.isFunction(listener)) {
            throw Error('invalid listener');
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
