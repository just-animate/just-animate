var helpers_1 = require('./helpers');
var TimelineAnimator = (function () {
    function TimelineAnimator(manager, options) {
        var sheetDuration = options.duration;
        if (sheetDuration === undefined) {
            throw Error('Duration is required');
        }
        var animationEvents = helpers_1.map(options.events, function (evt) {
            var keyframes;
            var timings;
            var el;
            if (evt.name) {
                var definition = manager.findAnimation(evt.name);
                var timings2 = helpers_1.extend({}, definition.timings);
                if (evt.timings) {
                    timings = helpers_1.extend(timings, evt.timings);
                }
                keyframes = definition.keyframes;
                timings = timings2;
                el = evt.el;
            }
            else {
                keyframes = evt.keyframes;
                timings = evt.timings;
                el = evt.el;
            }
            // calculate endtime
            var startTime = sheetDuration * evt.offset;
            var endTime = startTime + timings.duration;
            var isClipped = endTime > sheetDuration;
            // if end of animation is clipped, set endTime to duration            
            if (isClipped) {
                endTime = sheetDuration;
            }
            return {
                keyframes: keyframes,
                timings: timings,
                el: el,
                offset: evt.offset,
                _isClipped: isClipped,
                _startTimeMs: startTime,
                _endTimeMs: endTime
            };
        });
        this._duration = options.duration;
        this._events = animationEvents;
        if (options.autoplay) {
            this.play();
        }
    }
    TimelineAnimator.prototype.finish = function (fn) {
        return this;
    };
    TimelineAnimator.prototype.play = function (fn) {
        return this;
    };
    TimelineAnimator.prototype.pause = function (fn) {
        return this;
    };
    TimelineAnimator.prototype.reverse = function (fn) {
        return this;
    };
    TimelineAnimator.prototype.cancel = function (fn) {
        return this;
    };
    return TimelineAnimator;
})();
exports.TimelineAnimator = TimelineAnimator;
