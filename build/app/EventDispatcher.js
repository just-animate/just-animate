var helpers_1 = require('./helpers');
var EventDispatcher = (function () {
    function EventDispatcher() {
        this.eventListeners = {};
    }
    EventDispatcher.prototype.on = function (eventName, eventListener) {
        var eventListenerGroup = this.eventListeners[eventName];
        if (eventListenerGroup === undefined) {
            eventListenerGroup = [];
            this.eventListeners[eventName] = eventListenerGroup;
        }
        eventListenerGroup.push(eventListener);
    };
    EventDispatcher.prototype.off = function (eventName, eventListener) {
        var eventListenerGroup = this.eventListeners[eventName];
        if (eventListenerGroup === undefined) {
            return;
        }
        var index = eventListenerGroup.indexOf(eventListener);
        if (index === -1) {
            return;
        }
        eventListenerGroup.splice(index, 1);
    };
    EventDispatcher.prototype.dispatch = function (eventName, args, cb) {
        var eventListenerGroup = this.eventListeners[eventName];
        if (eventListenerGroup === undefined && eventListenerGroup.length === 0) {
            return;
        }
        helpers_1.multiapply(eventListenerGroup, undefined, [args], cb);
    };
    return EventDispatcher;
})();
exports.EventDispatcher = EventDispatcher;
