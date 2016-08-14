"use strict";
var lists_1 = require('../../common/lists');
var objects_1 = require('../../common/objects');
var resources_1 = require('../../common/resources');
var elements_1 = require('../../common/elements');
var dict_1 = require('../../common/dict');
var type_1 = require('../../common/type');
// todo: remove these imports as soon as possible
var KeyframeTransformers_1 = require('./KeyframeTransformers');
var KeyframeAnimation_1 = require('../waapi/KeyframeAnimation');
var KeyframePlugin = (function () {
    function KeyframePlugin() {
    }
    KeyframePlugin.prototype.canHandle = function (options) {
        return !!(options.name || options.css || options.keyframes);
    };
    KeyframePlugin.prototype.handle = function (options) {
        var targets = elements_1.queryElements(options.targets);
        var animations = lists_1.map(targets, function (target) {
            var timings = dict_1.createMap();
            timings.delay = objects_1.unwrap(options.delay) || 0;
            timings.endDelay = 0;
            timings.duration = options.to - options.from;
            timings.iterations = objects_1.unwrap(options.iterations) || 1;
            timings.iterationStart = objects_1.unwrap(options.iterationStart) || 0;
            timings.fill = objects_1.unwrap(options.fill) || 'none';
            timings.direction = objects_1.unwrap(options.direction) || resources_1.nil;
            // note: don't unwrap easings so we don't break this later with custom easings
            timings.easing = options.easing || 'linear';
            var sourceKeyframes = options.keyframes;
            var targetKeyframes = [];
            var keyframeLength = sourceKeyframes.length;
            for (var i = 0; i < keyframeLength; i++) {
                var sourceKeyframe = sourceKeyframes[i];
                var targetKeyframe = dict_1.createMap();
                for (var propertyName in sourceKeyframe) {
                    if (!sourceKeyframe.hasOwnProperty(propertyName)) {
                        continue;
                    }
                    var sourceValue = sourceKeyframe[propertyName];
                    if (!type_1.isDefined(sourceValue)) {
                        continue;
                    }
                    targetKeyframe[propertyName] = objects_1.unwrap(sourceValue);
                }
                // fixme: replace with mutation instead of copy                
                KeyframeTransformers_1.normalizeProperties(targetKeyframe);
                targetKeyframes.push(targetKeyframe);
            }
            KeyframeTransformers_1.spaceKeyframes(targetKeyframes);
            KeyframeTransformers_1.normalizeKeyframes(targetKeyframes);
            return new KeyframeAnimation_1.KeyframeAnimator(target, targetKeyframes, timings);
        });
        return animations;
    };
    return KeyframePlugin;
}());
exports.KeyframePlugin = KeyframePlugin;
