import { cssFunction, startsWith, toCamelCase } from '../../common/strings';

const SUBDIVISION_EPSILON = 0.0001;
const cssFunctionRegex = /([a-z-]+)\(([^\)]+)\)/ig;
const linearCubicBezier: ja.Func<number> = (x: number) => x;

const stepAliases = {
    end: 0,
    start: 1
};

const cb = 'cubic-bezier';
const st = 'steps';

const easings = {
    ease: [cb, .25, .1, .25, 1],
    easeIn: [cb, .42, 0, 1, 1],
    easeInBack: [cb, .6, -.28, .735, .045],
    easeInCirc: [cb, .6, .04, .98, .335],
    easeInCubic: [cb, .55, .055, .675, .19],
    easeInExpo: [cb, .95, .05, .795, .035],
    easeInOut: [cb, .42, 0, .58, 1],
    easeInOutBack: [cb, .68, -.55, .265, 1.55],
    easeInOutCirc: [cb, .785, .135, .15, .86],
    easeInOutCubic: [cb, .645, .045, .355, 1],
    easeInOutExpo: [cb, 1, 0, 0, 1],
    easeInOutQuad: [cb, .455, .03, .515, .955],
    easeInOutQuart: [cb, .77, 0, .175, 1],
    easeInOutQuint: [cb, .86, 0, .07, 1],
    easeInOutSine: [cb, .445, .05, .55, .95],
    easeInQuad: [cb, .55, .085, .68, .53],
    easeInQuart: [cb, .895, .03, .685, .22],
    easeInQuint: [cb, .755, .05, .855, .06],
    easeInSine: [cb, .47, 0, .745, .715],
    easeOut: [cb, 0, 0, .58, 1],
    easeOutBack: [cb, .175, .885, .32, 1.275],
    easeOutCirc: [cb, .075, .82, .165, 1],
    easeOutCubic: [cb, .215, .61, .355, 1],
    easeOutExpo: [cb, .19, 1, .22, 1],
    easeOutQuad: [cb, .25, .46, .45, .94],
    easeOutQuart: [cb, .165, .84, .44, 1],
    easeOutQuint: [cb, .23, 1, .32, 1],
    easeOutSine: [cb, .39, .575, .565, 1],
    elegantSlowStartEnd: [cb, .175, .885, .32, 1.275],
    linear: [cb, 0, 0, 1, 1],
    stepEnd: [st, 1, 'end'],
    stepStart: [st, 1, 'start']
};

const defaultEasing = easings.ease;

export function getEasingString(easingString: string): ja.Easing {
    // if no function supplied return linear as cubic
    if (easingString) {
        // if starts with known css function, return with no parsing
        if (startsWith(easingString, cb) || startsWith(easingString, st)) {
            return easingString;
        }
        // get name as camel case
        const def = easings[toCamelCase(easingString)];
        if (def) {
            return cssFunction.apply(undefined, def);
        }
    }
    return cssFunction.apply(undefined, defaultEasing);
}

export function getEasingFunction(easingString: string): ja.Func<number> {
    const parts = getEasingDef(easingString);
    return parts[0] === st
        ? steps(
            parts[1] as number,
            parts[2]
        )
        : cubic(
            parts[1] as number,
            parts[2] as number,
            parts[3] as number,
            parts[4] as number
        );
}

function getEasingDef(easingString: string): (number | string)[] {
    if (!easingString) {
        return defaultEasing;
    }
    const def: any[] = easings[toCamelCase(easingString)];
    if (def && def.length) {
        return def;
    }
    const matches = cssFunctionRegex.exec(easingString);
    if (matches && matches.length) {
        return [matches[1]].concat(matches[2].split(','));
    }
    return defaultEasing;
}

function bezier(n1: number, n2: number, t: number): number {
    return 3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t;
}

export function cubic(p0: number, p1: number, p2: number, p3: number): ja.Func<number> {
    if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
        return linearCubicBezier;
    }

    return (x: number): number => {
        if (x === 0 || x === 1) {
            return x;
        }

        let start = 0;
        let end = 1;
        let limit = 20;

        while (--limit) {
            const mid = (start + end) / 2;
            const xEst = bezier(p0, p2, mid);

            if (Math.abs(x - xEst) < SUBDIVISION_EPSILON) {
                return bezier(p1, p3, mid);
            }
            if (xEst < x) {
                start = mid;
            } else {
                end = mid;
            }
        }

        // limit is reached        
        return x;
    };
}


export function steps(count: number, pos?: number | string): ja.Func<number> {
    const p: number = stepAliases.hasOwnProperty(pos as string)
        ? stepAliases[pos as string]
        : pos as number;
    const ratio = count / 1;

    return (x: number): number => x >= 1 ? 1 : (p * ratio + x) - (p * ratio + x) % ratio;
}
