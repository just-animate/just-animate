import { cssFunction, startsWith, toCamelCase } from '../../common/strings';
import { cubicBezier as cb, steps, nil } from '../../common/resources';

const easings = {
    ease: [cb, 0.25, 0.1, 0.25, 1],
    easeIn: [cb, 0.42, 0, 1, 1],
    easeInBack: [cb, 0.6, -0.28, 0.735, 0.045],
    easeInCirc: [cb, 0.6, 0.04, 0.98, 0.335],
    easeInCubic: [cb, 0.55, 0.055, 0.675, 0.19],
    easeInExpo: [cb, 0.95, 0.05, 0.795, 0.035],
    easeInOut: [cb, 0.42, 0, 0.58, 1],    
    easeInOutBack: [cb, 0.68, -0.55, 0.265, 1.55],
    easeInOutCirc: [cb, 0.785, 0.135, 0.15, 0.86],
    easeInOutCubic: [cb, 0.645, 0.045, 0.355, 1],
    easeInOutExpo: [cb, 1, 0, 0, 1],
    easeInOutQuad: [cb, 0.455, 0.03, 0.515, 0.955],
    easeInOutQuart: [cb, 0.77, 0, 0.175, 1],
    easeInOutQuint: [cb, 0.86, 0, 0.07, 1],
    easeInOutSine: [cb, 0.445, 0.05, 0.55, 0.95],
    easeInQuad: [cb, 0.55, 0.085, 0.68, 0.53],
    easeInQuart: [cb, 0.895, 0.03, 0.685, 0.22],
    easeInQuint: [cb, 0.755, 0.05, 0.855, 0.06],
    easeInSine: [cb, 0.47, 0, 0.745, 0.715],
    easeOut: [cb, 0, 0, 0.58, 1],    
    easeOutBack: [cb, 0.175, 0.885, 0.32, 1.275],
    easeOutCirc: [cb, 0.075, 0.82, 0.165, 1],
    easeOutCubic: [cb, 0.215, 0.61, 0.355, 1],
    easeOutExpo: [cb, 0.19, 1, 0.22, 1],
    easeOutQuad: [cb, 0.25, 0.46, 0.45, 0.94],
    easeOutQuart: [cb, 0.165, 0.84, 0.44, 1],
    easeOutQuint: [cb, 0.23, 1, 0.32, 1],
    easeOutSine: [cb, 0.39, 0.575, 0.565, 1],
    elegantSlowStartEnd: [cb, 0.175, 0.885, 0.32, 1.275],
    linear: [cb, 0, 0, 1, 1],
    stepEnd: [steps, 'end'],    
    stepStart: [steps, 'start']
};

export function getEasingString(easingString: string): string {
    // if no function supplied return linear as cubic
    if (easingString) {
        // if starts with known css function, return with no parsing
        if (startsWith(easingString, cb) || startsWith(easingString, steps)) {
            return easingString;
        }
        // get name as camel case
        const name = toCamelCase(easingString);
        const def = easings[name];
        if (def) {
            return cssFunction.apply(nil, def);
        }
    }
    return cssFunction.apply(nil, easings.ease);
}
