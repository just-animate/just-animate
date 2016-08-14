"use strict";
var type_1 = require('../../common/type');
var strings_1 = require('../../common/strings');
var errors_1 = require('../../common/errors');
var resources_1 = require('../../common/resources');
var resources_2 = require('../../common/resources');
var offset = 'offset';
function spaceKeyframes(keyframes) {
    // don't attempt to fill animation if less than 2 keyframes
    if (keyframes.length < 2) {
        return keyframes;
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
    return keyframes;
}
exports.spaceKeyframes = spaceKeyframes;
/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
function normalizeKeyframes(keyframes) {
    // don't attempt to fill animation if less than 2 keyframes
    if (keyframes.length < 2) {
        return keyframes;
    }
    var first = keyframes[0];
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }
    var last = keyframes[keyframes.length - 1];
    // fill initial keyframe with missing props
    var len = keyframes.length;
    for (var i = 1; i < len; i++) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop !== offset && !type_1.isDefined(first[prop])) {
                first[prop] = keyframe[prop];
            }
        }
    }
    // fill end keyframe with missing props
    for (var i = len - 2; i > -1; i--) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop !== offset && !type_1.isDefined(last[prop])) {
                last[prop] = keyframe[prop];
            }
        }
    }
    return keyframes;
}
exports.normalizeKeyframes = normalizeKeyframes;
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
    var output = {};
    var transformString = '';
    for (var prop in keyframe) {
        var value = keyframe[prop];
        if (!type_1.isDefined(value)) {
            continue;
        }
        switch (prop) {
            case resources_2.scale3d:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        throw errors_1.invalidArg(resources_2.scale3d);
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
                throw errors_1.invalidArg(resources_2.scale3d);
            case resources_2.scale:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw errors_1.invalidArg(resources_2.scale);
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
                throw errors_1.invalidArg(resources_2.scale);
            case resources_2.scaleX:
                if (type_1.isNumber(value)) {
                    scaleArray[xIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.scaleX);
            case resources_2.scaleY:
                if (type_1.isNumber(value)) {
                    scaleArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.scaleY);
            case resources_2.scaleZ:
                if (type_1.isNumber(value)) {
                    scaleArray[zIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.scaleZ);
            case resources_2.skew:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw errors_1.invalidArg(resources_2.skew);
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
                throw errors_1.invalidArg(resources_2.skew);
            case resources_2.skewX:
                if (type_1.isString(value)) {
                    skewArray[xIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.skewX);
            case resources_2.skewY:
                if (type_1.isString(value)) {
                    skewArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.skewY);
            case resources_2.rotate3d:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 4) {
                        throw errors_1.invalidArg(resources_2.rotate3d);
                    }
                    transformString += " rotate3d(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + arr[3] + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_2.rotate3d);
            case resources_2.rotateX:
                if (type_1.isString(value)) {
                    transformString += " rotate3d(1, 0, 0, " + value + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_2.rotateX);
            case resources_2.rotateY:
                if (type_1.isString(value)) {
                    transformString += " rotate3d(0, 1, 0, " + value + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_2.rotateY);
            case resources_2.rotate:
            case resources_2.rotateZ:
                if (type_1.isString(value)) {
                    transformString += " rotate3d(0, 0, 1, " + value + ")";
                    continue;
                }
                throw errors_1.invalidArg(resources_2.rotateZ);
            case resources_2.translate3d:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        throw errors_1.invalidArg(resources_2.translate3d);
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
                throw errors_1.invalidArg(resources_2.rotate3d);
            case resources_2.translate:
                if (type_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw errors_1.invalidArg(resources_2.translate);
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
                throw errors_1.invalidArg(resources_2.translate);
            case resources_2.x:
            case resources_2.translateX:
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[xIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.x);
            case resources_2.y:
            case resources_2.translateY:
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[yIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.y);
            case resources_2.z:
            case resources_2.translateZ:
                if (type_1.isString(value) || type_1.isNumber(value)) {
                    translateArray[zIndex] = value;
                    continue;
                }
                throw errors_1.invalidArg(resources_2.z);
            case resources_2.transform:
                transformString += ' ' + value;
                break;
            default:
                output[strings_1.toCamelCase(prop)] = value;
                break;
        }
    }
    // combine scale
    var isScaleX = scaleArray[xIndex] !== resources_1.nil;
    var isScaleY = scaleArray[yIndex] !== resources_1.nil;
    var isScaleZ = scaleArray[zIndex] !== resources_1.nil;
    if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
        var scaleString = scaleArray.map(function (s) { return s || '1'; }).join(',');
        transformString += " scale3d(" + scaleString + ")";
    }
    else if (isScaleX && isScaleY) {
        transformString += " scale(" + (scaleArray[xIndex] || 1) + ", " + (scaleArray[yIndex] || 1) + ")";
    }
    else if (isScaleX) {
        transformString += " scaleX(" + scaleArray[xIndex] + ")";
    }
    else if (isScaleY) {
        transformString += " scaleX(" + scaleArray[yIndex] + ")";
    }
    else if (isScaleZ) {
        transformString += " scaleX(" + scaleArray[zIndex] + ")";
    }
    else {
    }
    // combine skew
    var isskewX = skewArray[xIndex] !== resources_1.nil;
    var isskewY = skewArray[yIndex] !== resources_1.nil;
    if (isskewX && isskewY) {
        transformString += " skew(" + (skewArray[xIndex] || 1) + ", " + (skewArray[yIndex] || 1) + ")";
    }
    else if (isskewX) {
        transformString += " skewX(" + skewArray[xIndex] + ")";
    }
    else if (isskewY) {
        transformString += " skewY(" + skewArray[yIndex] + ")";
    }
    else {
    }
    // combine translate
    var istranslateX = translateArray[xIndex] !== resources_1.nil;
    var istranslateY = translateArray[yIndex] !== resources_1.nil;
    var istranslateZ = translateArray[zIndex] !== resources_1.nil;
    if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
        var translateString = translateArray.map(function (s) { return s || '1'; }).join(',');
        transformString += " translate3d(" + translateString + ")";
    }
    else if (istranslateX && istranslateY) {
        transformString += " translate(" + (translateArray[xIndex] || 1) + ", " + (translateArray[yIndex] || 1) + ")";
    }
    else if (istranslateX) {
        transformString += " translateX(" + translateArray[xIndex] + ")";
    }
    else if (istranslateY) {
        transformString += " translateY(" + translateArray[yIndex] + ")";
    }
    else if (istranslateZ) {
        transformString += " translateZ(" + translateArray[zIndex] + ")";
    }
    else {
    }
    if (transformString) {
        output['transform'] = transformString;
    }
    return output;
}
exports.normalizeProperties = normalizeProperties;
