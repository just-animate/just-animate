"use strict";
var type_1 = require('../../common/type');
var strings_1 = require('../../common/strings');
var errors_1 = require('../../common/errors');
var easings_1 = require('../../common/easings');
var lists_1 = require('../../common/lists');
var objects_1 = require('../../common/objects');
var KeyframeAnimator_1 = require('../waapi/KeyframeAnimator');
var units_1 = require('../../common/units');
var resources_1 = require('../../common/resources');
var global = window;
var transitionAliases = {
    rotate: resources_1.transform,
    rotate3d: resources_1.transform,
    rotateX: resources_1.transform,
    rotateY: resources_1.transform,
    rotateZ: resources_1.transform,
    scale: resources_1.transform,
    scale3d: resources_1.transform,
    scaleX: resources_1.transform,
    scaleY: resources_1.transform,
    scaleZ: resources_1.transform,
    skew: resources_1.transform,
    skewX: resources_1.transform,
    skewY: resources_1.transform,
    translate: resources_1.transform,
    translate3d: resources_1.transform,
    translateX: resources_1.transform,
    translateY: resources_1.transform,
    translateZ: resources_1.transform,
    x: resources_1.transform,
    y: resources_1.transform,
    z: resources_1.transform
};
function createAnimator(ctx) {
    var options = ctx.options;
    var delay = units_1.resolveTimeExpression(objects_1.unwrap(options.delay, ctx) || 0, ctx.index);
    var endDelay = units_1.resolveTimeExpression(objects_1.unwrap(options.endDelay, ctx) || 0, ctx.index);
    var iterations = objects_1.unwrap(options.iterations, ctx) || 1;
    var iterationStart = objects_1.unwrap(options.iterationStart, ctx) || 0;
    var direction = objects_1.unwrap(options.direction, ctx) || resources_1.nil;
    var duration = options.to - options.from;
    var fill = objects_1.unwrap(options.fill, ctx) || 'none';
    var totalTime = delay + ((iterations || 1) * duration) + endDelay;
    // note: don't unwrap easings so we don't break this later with custom easings
    var easing = options.easing || 'linear';
    var timings = {
        delay: delay,
        endDelay: endDelay,
        duration: duration,
        iterations: iterations,
        iterationStart: iterationStart,
        fill: fill,
        direction: direction,
        easing: easing
    };
    var animator = new KeyframeAnimator_1.KeyframeAnimator(initAnimator.bind(resources_1.nada, timings, ctx));
    animator.totalDuration = totalTime;
    if (type_1.isFunction(options.update)) {
        animator.onupdate = options.update;
    }
    return animator;
}
exports.createAnimator = createAnimator;
function initAnimator(timings, ctx) {
    // process css as either keyframes or calculate what those keyframes should be   
    var options = ctx.options;
    var target = ctx.target;
    var css = options.css;
    var sourceKeyframes;
    if (type_1.isArray(css)) {
        // if an array, no processing has to occur
        sourceKeyframes = css;
        expandOffsets(sourceKeyframes);
    }
    else {
        sourceKeyframes = [];
        propsToKeyframes(css, sourceKeyframes, ctx);
    }
    var targetKeyframes = [];
    unwrapPropertiesInKeyframes(sourceKeyframes, targetKeyframes, ctx);
    spaceKeyframes(targetKeyframes);
    if (options.isTransition === true) {
        addTransition(targetKeyframes, target);
    }
    else {
        fixPartialKeyframes(targetKeyframes);
    }
    var animator = target[resources_1.animate](targetKeyframes, timings);
    animator.cancel();
    return animator;
}
function addTransition(keyframes, target) {
    // detect properties to transition
    var properties = objects_1.listProps(keyframes);
    // get or create the first frame
    var firstFrame = lists_1.head(keyframes, function (t) { return t.offset === 0; });
    if (!firstFrame) {
        firstFrame = { offset: 0 };
        keyframes.splice(0, 0, firstFrame);
    }
    // copy properties from the dom to the animation
    // todo: check how to do this in IE8, or not?
    var style = global.getComputedStyle(target);
    lists_1.each(properties, function (property) {
        // skip offset property
        if (property === resources_1.offsetString) {
            return;
        }
        var alias = transitionAliases[property] || property;
        var val = style[alias];
        if (type_1.isDefined(val)) {
            firstFrame[alias] = val;
        }
    });
}
/**
 * copies keyframs with an offset array to separate keyframes
 *
 * @export
 * @param {waapi.IKeyframe[]} keyframes
 */
function expandOffsets(keyframes) {
    var len = keyframes.length;
    for (var i = len - 1; i > -1; --i) {
        var keyframe = keyframes[i];
        if (type_1.isArray(keyframe.offset)) {
            keyframes.splice(i, 1);
            var offsets = keyframe.offset;
            var offsetLen = offsets.length;
            for (var j = offsetLen - 1; j > -1; --j) {
                var offsetAmount = offsets[j];
                var newKeyframe = {};
                for (var prop in keyframe) {
                    if (prop !== resources_1.offsetString) {
                        newKeyframe[prop] = keyframe[prop];
                    }
                }
                newKeyframe.offset = offsetAmount;
                keyframes.splice(i, 0, newKeyframe);
            }
        }
    }
}
function unwrapPropertiesInKeyframes(source, target, ctx) {
    var len = source.length;
    for (var i = 0; i < len; i++) {
        var sourceKeyframe = source[i];
        var targetKeyframe = {};
        for (var propertyName in sourceKeyframe) {
            if (!sourceKeyframe.hasOwnProperty(propertyName)) {
                continue;
            }
            var sourceValue = sourceKeyframe[propertyName];
            if (!type_1.isDefined(sourceValue)) {
                continue;
            }
            targetKeyframe[propertyName] = objects_1.unwrap(sourceValue, ctx);
        }
        normalizeProperties(targetKeyframe);
        target.push(targetKeyframe);
    }
}
function propsToKeyframes(css, keyframes, ctx) {
    // create a map to capture each keyframe by offset
    var keyframesByOffset = {};
    var cssProps = css;
    // iterate over each property split it into keyframes            
    for (var prop in cssProps) {
        if (!cssProps.hasOwnProperty(prop)) {
            continue;
        }
        // unwrap value (changes function into discrete value or array)                    
        var val = objects_1.unwrap(cssProps[prop], ctx);
        if (type_1.isArray(val)) {
            // if the value is an array, split up the offset automatically
            var valAsArray = val;
            var valLength = valAsArray.length;
            for (var i = 0; i < valLength; i++) {
                var offset = i === 0 ? 0 : i === valLength - 1 ? 1 : i / (valLength - 1.0);
                var keyframe = keyframesByOffset[offset];
                if (!keyframe) {
                    keyframe = {};
                    keyframesByOffset[offset] = keyframe;
                }
                keyframe[prop] = val[i];
            }
        }
        else {
            // if the value is not an array, place it at offset 1
            var keyframe = keyframesByOffset[1];
            if (!keyframe) {
                keyframe = {};
                keyframesByOffset[1] = keyframe;
            }
            keyframe[prop] = val;
        }
    }
    for (var offset in keyframesByOffset) {
        var keyframe = keyframesByOffset[offset];
        keyframe.offset = Number(offset);
        keyframes.push(keyframe);
    }
}
function spaceKeyframes(keyframes) {
    // don't attempt to fill animation if less than 2 keyframes
    if (keyframes.length < 2) {
        return;
    }
    var first = keyframes[0];
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }
    var last = keyframes[keyframes.length - 1];
    // ensure last offset
    if (last.offset !== 1) {
        last.offset = 1;
    }
    // explicitly set implicit offsets
    var len = keyframes.length;
    var lasti = len - 1;
    for (var i = 1; i < lasti; i++) {
        var target = keyframes[i];
        // skip entries that have an offset        
        if (type_1.isNumber(target.offset)) {
            continue;
        }
        // search for the next offset with a value        
        for (var j = i + 1; j < len; j++) {
            // pass if offset is not set
            if (!type_1.isNumber(keyframes[j].offset)) {
                continue;
            }
            // calculate timing/position info
            var startTime = keyframes[i - 1].offset;
            var endTime = keyframes[j].offset;
            var timeDelta = endTime - startTime;
            var deltaLength = j - i + 1;
            // set the values of all keyframes between i and j (exclusive)
            for (var k = 1; k < deltaLength; k++) {
                // set to percentage of change over time delta + starting time
                keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime;
            }
            // move i past this keyframe since all frames between should be processed
            i = j;
            break;
        }
    }
}
/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
function fixPartialKeyframes(keyframes) {
    // don't attempt to fill animation if less than 1 keyframes
    if (keyframes.length < 1) {
        return;
    }
    var first = lists_1.head(keyframes, function (k) { return k.offset === 0; })
        || lists_1.head(keyframes, function (k) { return k.offset === resources_1.nil; });
    if (first === resources_1.nil) {
        first = {};
        keyframes.splice(0, 0, first);
    }
    if (first.offset === resources_1.nil) {
        first.offset = 0;
    }
    var last = lists_1.tail(keyframes, function (k) { return k.offset === 1; })
        || lists_1.tail(keyframes, function (k) { return k.offset === resources_1.nil; });
    if (last === resources_1.nil) {
        last = {};
        keyframes.push(last);
    }
    if (last.offset === resources_1.nil) {
        last.offset = 0;
    }
    // fill initial keyframe with missing props
    var len = keyframes.length;
    for (var i = 1; i < len; i++) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop !== resources_1.offsetString && !type_1.isDefined(first[prop])) {
                first[prop] = keyframe[prop];
            }
        }
    }
    // fill end keyframe with missing props
    for (var i = len - 2; i > -1; i--) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop !== resources_1.offsetString && !type_1.isDefined(last[prop])) {
                last[prop] = keyframe[prop];
            }
        }
    }
    // sort by offset (should have all offsets assigned)
    keyframes.sort(keyframeOffsetComparer);
}
function keyframeOffsetComparer(a, b) {
    return a.offset - b.offset;
}
/**
 * Handles transforming short hand key properties into their native form
 */
function normalizeProperties(keyframe) {
    var xIndex = 0;
    var yIndex = 1;
    var zIndex = 2;
    // transform properties
    var scaleArray = [];
    var skewArray = [];
    var translateArray = [];
    var cssTransform = '';
    for (var prop in keyframe) {
        var value = keyframe[prop];
        if (!type_1.isDefined(value)) {
            keyframe[prop] = resources_1.nil;
            continue;
        }
        if (prop === resources_1.easingString) {
            var easing = keyframe[resources_1.easingString];
            keyframe[resources_1.easingString] = easings_1.easings[easing] || easing || resources_1.nil;
            continue;
        }
        // nullify properties (will get added back if it is supposed to be here)
        keyframe[prop] = resources_1.nil;
        switch (prop) {
            case resources_1.scale3d:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        throw errors_1.invalidArg(resources_1.scale3d);
                    }
                    scaleArray[xIndex] = arr[xIndex];
                    scaleArray[yIndex] = arr[yIndex];
                    scaleArray[zIndex] = arr[zIndex];
                    continue;
                }
                if (type_1.isNumber(value)) {
                    scaleArray[xIndex] = value;
                    scaleArray[yIndex] = value;
                    scaleArray[zIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.scale3d);
            case resources_1.scale:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw errors_1.invalidArg(resources_1.scale);
                    }
                    scaleArray[xIndex] = arr[xIndex];
                    scaleArray[yIndex] = arr[yIndex];
                    continue;
                }
                if (type_1.isNumber(value)) {
                    scaleArray[xIndex] = value;
                    scaleArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.scale);
            case resources_1.scaleX:
                if (type_1.isNumber(value)) {
                    scaleArray[xIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.scaleX);
            case resources_1.scaleY:
                if (type_1.isNumber(value)) {
                    scaleArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.scaleY);
            case resources_1.scaleZ:
                if (type_1.isNumber(value)) {
                    scaleArray[zIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.scaleZ);
            case resources_1.skew:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw errors_1.invalidArg(resources_1.skew);
                    }
                    skewArray[xIndex] = arr[xIndex];
                    skewArray[yIndex] = arr[yIndex];
                    continue;
                }
                if (type_1.isNumber(value)) {
                    skewArray[xIndex] = value;
                    skewArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.skew);
            case resources_1.skewX:
                if (type_1.isString(value)) {
                    skewArray[xIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.skewX);
            case resources_1.skewY:
                if (type_1.isString(value)) {
                    skewArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.skewY);
            case resources_1.rotate3d:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 4) {
                        throw errors_1.invalidArg(resources_1.rotate3d);
                    }
                    cssTransform += " rotate3d(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + arr[3] + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_1.rotate3d);
            case resources_1.rotateX:
                if (type_1.isString(value)) {
                    cssTransform += " rotate3d(1, 0, 0, " + value + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_1.rotateX);
            case resources_1.rotateY:
                if (type_1.isString(value)) {
                    cssTransform += " rotate3d(0, 1, 0, " + value + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_1.rotateY);
            case resources_1.rotate:
            case resources_1.rotateZ:
                if (type_1.isString(value)) {
                    cssTransform += " rotate3d(0, 0, 1, " + value + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_1.rotateZ);
            case resources_1.translate3d:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        throw errors_1.invalidArg(resources_1.translate3d);
                    }
                    translateArray[xIndex] = arr[xIndex];
                    translateArray[yIndex] = arr[yIndex];
                    translateArray[zIndex] = arr[zIndex];
                    continue;
                }
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[xIndex] = value;
                    translateArray[yIndex] = value;
                    translateArray[zIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.rotate3d);
            case resources_1.translate:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw errors_1.invalidArg(resources_1.translate);
                    }
                    translateArray[xIndex] = arr[xIndex];
                    translateArray[yIndex] = arr[yIndex];
                    continue;
                }
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[xIndex] = value;
                    translateArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.translate);
            case resources_1.x:
            case resources_1.translateX:
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[xIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.x);
            case resources_1.y:
            case resources_1.translateY:
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.y);
            case resources_1.z:
            case resources_1.translateZ:
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[zIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_1.z);
            case resources_1.transform:
                cssTransform += ' ' + value;
                break;
            default:
                keyframe[strings_1.toCamelCase(prop)] = value;
                break;
        }
    }
    // combine scale
    var isScaleX = scaleArray[xIndex] !== resources_1.nil;
    var isScaleY = scaleArray[yIndex] !== resources_1.nil;
    var isScaleZ = scaleArray[zIndex] !== resources_1.nil;
    if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
        var scaleString = scaleArray.map(function (s) { return s || '1'; }).join(',');
        cssTransform += " scale3d(" + scaleString + ")";
    }
    else if (isScaleX && isScaleY) {
        cssTransform += " scale(" + (scaleArray[xIndex] || 1) + ", " + (scaleArray[yIndex] || 1) + ")";
    }
    else if (isScaleX) {
        cssTransform += " scaleX(" + scaleArray[xIndex] + ")";
    }
    else if (isScaleY) {
        cssTransform += " scaleX(" + scaleArray[yIndex] + ")";
    }
    else if (isScaleZ) {
        cssTransform += " scaleX(" + scaleArray[zIndex] + ")";
    }
    else {
    }
    // combine skew
    var isskewX = skewArray[xIndex] !== resources_1.nil;
    var isskewY = skewArray[yIndex] !== resources_1.nil;
    if (isskewX && isskewY) {
        cssTransform += " skew(" + (skewArray[xIndex] || 1) + ", " + (skewArray[yIndex] || 1) + ")";
    }
    else if (isskewX) {
        cssTransform += " skewX(" + skewArray[xIndex] + ")";
    }
    else if (isskewY) {
        cssTransform += " skewY(" + skewArray[yIndex] + ")";
    }
    else {
    }
    // combine translate
    var istranslateX = translateArray[xIndex] !== resources_1.nil;
    var istranslateY = translateArray[yIndex] !== resources_1.nil;
    var istranslateZ = translateArray[zIndex] !== resources_1.nil;
    if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
        var translateString = translateArray.map(function (s) { return s || '1'; }).join(',');
        cssTransform += " translate3d(" + translateString + ")";
    }
    else if (istranslateX && istranslateY) {
        cssTransform += " translate(" + (translateArray[xIndex] || 1) + ", " + (translateArray[yIndex] || 1) + ")";
    }
    else if (istranslateX) {
        cssTransform += " translateX(" + translateArray[xIndex] + ")";
    }
    else if (istranslateY) {
        cssTransform += " translateY(" + translateArray[yIndex] + ")";
    }
    else if (istranslateZ) {
        cssTransform += " translateZ(" + translateArray[zIndex] + ")";
    }
    else {
    }
    if (cssTransform) {
        keyframe[resources_1.transform] = cssTransform;
    }
}
