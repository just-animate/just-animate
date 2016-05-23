import { isNumber, isString, isArray } from './Helpers';

const browserRules: ja.IMap<IKeyframeTransformer> = {
    scale3d(val: number | number[], output: ja.IKeyframe): void {
        if (isNumber(val)) {
            output.transform = `${output.transform || ''} scale3d(${val}, ${val}, ${val})`;
            return;
        }
        if (isArray(val)) {
            const arr = val as number[];
            if (arr.length !== 3) {
                throw Error('scale3d requires x, y, & z');
            }
            output.transform = `${output.transform || ''} scale3d(${arr[0]}, ${arr[1]}, ${arr[2]})`;
            return;
        }

        throw Error('scale3d requires a number or number[]');
    },
    translate3d(val: string | string[], output: ja.IKeyframe): void {
        if (isString(val)) {
            output.transform = `${output.transform || ''} translate3d(${val}, ${val}, ${val})`;
            return;
        }
        if (isArray(val)) {
            const arr = val as string[];
            if (arr.length !== 3) {
                throw Error('translate3d requires x, y, & z');
            }
            output.transform = `${output.transform || ''} translate3d(${arr[0]}, ${arr[1]}, ${arr[2]})`;
            return;
        }

        throw Error('translate3d requires number, string, or an array of strings or numbers');
    }
};

export const keyframeTransformer = createTransformer(browserRules);

function createTransformer(rules: ja.IMap<IKeyframeTransformer>) {
    return (keyframe: ja.IKeyframe) => {
        const output: ja.IKeyframe = {};
        for (let prop in keyframe) {
            const value = keyframe[prop];
            const transformer = rules[prop];
            if (!transformer) {
                output[prop] = value;
                continue;
            }
            transformer(value, output);
        }
        return output;
    }
}

interface IKeyframeTransformer {
    (val: any, output: ja.IKeyframe): void;
}
