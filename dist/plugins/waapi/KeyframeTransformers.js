"use strict";
var type_1 = require("../../common/type");
var strings_1 = require("../../common/strings");
var easings_1 = require("../core/easings");
var lists_1 = require("../../common/lists");
var units_1 = require("../../common/units");
var objects_1 = require("../../common/objects");
var errors_1 = require("../../common/errors");
var resources_1 = require("../../common/resources");
var propertyAliases = {
    x: resources_1.translateX,
    y: resources_1.translateY,
    z: resources_1.translateZ
};
var transforms = [
    'perspective',
    'matrix',
    resources_1.translateX,
    resources_1.translateY,
    resources_1.translateZ,
    resources_1.translate,
    resources_1.translate3d,
    resources_1.x,
    resources_1.y,
    resources_1.z,
    resources_1.skew,
    resources_1.skewX,
    resources_1.skewY,
    resources_1.rotateX,
    resources_1.rotateY,
    resources_1.rotateZ,
    resources_1.rotate,
    resources_1.rotate3d,
    resources_1.scaleX,
    resources_1.scaleY,
    resources_1.scaleZ,
    resources_1.scale,
    resources_1.scale3d
];
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
    resolvePropertiesInKeyframes(sourceKeyframes, targetKeyframes, ctx);
    if (options.isTransition === true) {
        addTransition(targetKeyframes, target);
    }
    spaceKeyframes(targetKeyframes);
    arrangeKeyframes(targetKeyframes);
    fixPartialKeyframes(targetKeyframes);
    var animator = target[resources_1.animate](targetKeyframes, timings);
    animator.cancel();
    return animator;
}
exports.initAnimator = initAnimator;
function addTransition(keyframes, target) {
    // detect properties to transition
    var properties = objects_1.listProps(keyframes);
    // copy properties from the dom to the animation
    // todo: check how to do this in IE8, or not?
    var style = window.getComputedStyle(target);
    // create the first frame
    var firstFrame = { offset: 0 };
    keyframes.splice(0, 0, firstFrame);
    properties.forEach(function (property) {
        // skip offset property
        if (property === resources_1.offsetString) {
            return;
        }
        var alias = transforms.indexOf(property) !== -1 ? resources_1.transform : property;
        var val = style[alias];
        if (type_1.isDefined(val)) {
            firstFrame[alias] = val;
        }
    });
}
exports.addTransition = addTransition;
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
        if (!type_1.isArray(keyframe.offset)) {
            continue;
        }
        keyframes.splice(i, 1);
        var offsets = keyframe.offset;
        var offsetLen = offsets.length;
        for (var j = 0; j < offsetLen; j++) {
            var newKeyframe = objects_1.deepCopyObject(keyframe);
            newKeyframe.offset = offsets[j];
            keyframes.splice(i, 0, newKeyframe);
        }
    }
    // resort by offset    
    keyframes.sort(keyframeOffsetComparer);
}
exports.expandOffsets = expandOffsets;
function resolvePropertiesInKeyframes(source, target, ctx) {
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
            targetKeyframe[propertyName] = objects_1.resolve(sourceValue, ctx);
        }
        normalizeProperties(targetKeyframe);
        target.push(targetKeyframe);
    }
}
exports.resolvePropertiesInKeyframes = resolvePropertiesInKeyframes;
function propsToKeyframes(css, keyframes, ctx) {
    // create a map to capture each keyframe by offset
    var keyframesByOffset = {};
    var cssProps = css;
    // iterate over each property split it into keyframes            
    for (var prop in cssProps) {
        if (!cssProps.hasOwnProperty(prop)) {
            continue;
        }
        // resolve value (changes function into discrete value or array)                    
        var val = objects_1.resolve(cssProps[prop], ctx);
        if (type_1.isArray(val)) {
            // if the value is an array, split up the offset automatically
            var valAsArray = val;
            var valLength = valAsArray.length;
            for (var i = 0; i < valLength; i++) {
                var offset = i === 0 ? 0
                    : i === valLength - 1 ? 1
                        : i / (valLength - 1.0);
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
    // get list of transform properties in object
    var includedTransforms = Object
        .keys(cssProps)
        .filter(function (c) { return transforms.indexOf(c) !== -1; });
    var offsets = Object
        .keys(keyframesByOffset)
        .map(function (s) { return Number(s); })
        .sort();
    var unit = units_1.Unit();
    // if prop not present calculate each transform property in list
    // a keyframe at offset 1 should be guaranteed for each property, so skip that one
    for (var i = offsets.length - 2; i > -1; --i) {
        var offset = offsets[i];
        var keyframe = keyframesByOffset[offset];
        // foreach keyframe if has transform property
        for (var _i = 0, includedTransforms_1 = includedTransforms; _i < includedTransforms_1.length; _i++) {
            var transform_1 = includedTransforms_1[_i];
            if (type_1.isDefined(keyframe[transform_1])) {
                continue;
            }
            // get the next keyframe (should always be one ahead with a good value)
            var endOffset = offsets[i + 1];
            var endKeyframe = keyframesByOffset[endOffset];
            // parse out unit values of next keyframe       
            units_1.fromAnyUnit(endKeyframe[transform_1], unit);
            var endValue = unit.value;
            var endUnitType = unit.unit;
            // search downward for the previous value or use defaults  
            var startIndex = 0;
            var startValue = endValue;
            var startOffset = 0;
            var startUnit = resources_1.nil;
            for (var j = i - 1; j > -1; --j) {
                var offset1 = offsets[j];
                var keyframe1 = keyframesByOffset[offset1];
                if (type_1.isDefined(keyframe1[transform_1])) {
                    units_1.fromAnyUnit(keyframe1[transform_1], unit);
                    startValue = unit.value;
                    startUnit = unit.unit;
                    startIndex = j;
                    startOffset = offsets[j];
                    break;
                }
            }
            if (startValue !== 0 && type_1.isDefined(startUnit) && type_1.isDefined(endUnitType) && startUnit !== endUnitType) {
                throw errors_1.unsupported('Mixed transform property units');
            }
            // iterate forward
            for (var j = startIndex; j < i + 1; j++) {
                var currentOffset = offsets[j];
                var currentKeyframe = keyframesByOffset[currentOffset];
                // calculate offset delta (how much animation progress to apply)
                var offsetDelta = (currentOffset - startOffset) / (endOffset - startOffset);
                var currentValue = startValue + (endValue - startValue) * offsetDelta;
                var currentValueWithUnit = type_1.isDefined(endUnitType)
                    ? currentValue + endUnitType
                    : type_1.isDefined(startUnit)
                        ? currentValue + startUnit
                        : currentValue;
                currentKeyframe[transform_1] = currentValueWithUnit;
                // move reference point forward
                startOffset = currentOffset;
                startValue = currentValue;
            }
        }
    }
    // reassemble as array
    for (var offset in keyframesByOffset) {
        var keyframe = keyframesByOffset[offset];
        keyframe.offset = Number(offset);
        keyframes.push(keyframe);
    }
    // resort by offset    
    keyframes.sort(keyframeOffsetComparer);
}
exports.propsToKeyframes = propsToKeyframes;
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
exports.spaceKeyframes = spaceKeyframes;
function arrangeKeyframes(keyframes) {
    // don't arrange frames if there aren't any
    if (keyframes.length < 1) {
        return;
    }
    var first = lists_1.head(keyframes, function (k) { return k.offset === 0; })
        || lists_1.head(keyframes, function (k) { return k.offset === resources_1.nil; });
    if (first === resources_1.nil) {
        first = {};
        keyframes.splice(0, 0, first);
    }
    if (first.offset !== 0) {
        first.offset = 0;
    }
    var last = lists_1.tail(keyframes, function (k) { return k.offset === 1; })
        || lists_1.tail(keyframes, function (k) { return k.offset === resources_1.nil; });
    if (last === resources_1.nil) {
        last = {};
        keyframes.push(last);
    }
    if (last.offset !== 1) {
        last.offset = 0;
    }
    // sort by offset (should have all offsets assigned)
    keyframes.sort(keyframeOffsetComparer);
}
exports.arrangeKeyframes = arrangeKeyframes;
/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
function fixPartialKeyframes(keyframes) {
    // don't attempt to fill animation if less than 1 keyframes
    if (keyframes.length < 1) {
        return;
    }
    var first = lists_1.head(keyframes);
    var last = lists_1.tail(keyframes);
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
}
exports.fixPartialKeyframes = fixPartialKeyframes;
function keyframeOffsetComparer(a, b) {
    return a.offset - b.offset;
}
exports.keyframeOffsetComparer = keyframeOffsetComparer;
function transformPropertyComparer(a, b) {
    return transforms.indexOf(a[0]) - transforms.indexOf(b[0]);
}
exports.transformPropertyComparer = transformPropertyComparer;
/**
 * Handles transforming short hand key properties into their native form
 */
function normalizeProperties(keyframe) {
    var cssTransforms = [];
    for (var prop in keyframe) {
        var value = keyframe[prop];
        if (!type_1.isDefined(value)) {
            keyframe[prop] = resources_1.nil;
            continue;
        }
        // nullify properties so shorthand and handled properties don't end up in the result
        keyframe[prop] = resources_1.nil;
        // get the final property name
        var propAlias = propertyAliases[prop] || prop;
        // find out if the property needs to end up on transform
        var transformIndex = transforms.indexOf(propAlias);
        if (transformIndex !== -1) {
            // handle transforms
            cssTransforms.push([propAlias, value]);
        }
        else if (propAlias === resources_1.easingString) {
            // handle easings
            keyframe[resources_1.easingString] = easings_1.getEasingString(value);
        }
        else {
            // handle others (change background-color and the like to backgroundColor)
            keyframe[strings_1.toCamelCase(propAlias)] = value;
        }
    }
    if (cssTransforms.length) {
        keyframe[resources_1.transform] = cssTransforms
            .sort(transformPropertyComparer)
            .reduce(function (c, n) { return c + (" " + n[0] + "(" + n[1] + ")"); }, '');
    }
}
exports.normalizeProperties = normalizeProperties;
