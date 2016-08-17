import {map} from '../../common/lists';
import {unwrap} from '../../common/objects';
import {nil} from '../../common/resources';
import {queryElements} from '../../common/elements';
import {createMap} from '../../common/dict';
import {isArray, isDefined, isNumber} from '../../common/type';
 
// todo: remove these imports as soon as possible
import {normalizeProperties, normalizeKeyframes, spaceKeyframes} from './KeyframeTransformers';
import {KeyframeAnimator} from '../waapi/KeyframeAnimation';


export class KeyframePlugin implements ja.IPlugin {
    public canHandle(options: ja.IAnimationOptions): boolean {
        return !!(options.css);
    }
    
    public handle(options: ja.IAnimationOptions): ja.IAnimationController[] {

        const targets = queryElements(options.targets);

        const animations = map(targets, (target: Element) => {
            const timings = createMap<waapi.IEffectTiming>();
            timings.delay = unwrap(options.delay) || 0;
            timings.endDelay = 0;
            timings.duration = options.to - options.from;
            timings.iterations = unwrap(options.iterations) || 1;
            timings.iterationStart = unwrap(options.iterationStart) || 0;
            timings.fill = unwrap(options.fill) || 'none';
            timings.direction = unwrap(options.direction) || nil;

            // note: don't unwrap easings so we don't break this later with custom easings
            timings.easing = options.easing || 'linear';

            // process css as either keyframes or calculate what those keyframes should be   
            const css = options.css;
            let sourceKeyframes: ja.ICssKeyframeOptions[];
            if (isArray(css)) {
                // if an array, no processing has to occur
                sourceKeyframes = css as ja.ICssKeyframeOptions[];
            } else {
                // create a map to capture each keyframe by offset
                const keyframesByOffset = createMap<{ [key: number]: ja.ICssKeyframeOptions }>();
                const cssProps = css as ja.ICssPropertyOptions;

                // iterate over each property split it into keyframes            
                for (let prop in cssProps) {
                    if (!cssProps.hasOwnProperty(prop)) {
                        continue;
                    }

                    // unwrap value (changes function into discrete value or array)                    
                    const val = unwrap(cssProps[prop]);

                    if (isArray(val)) {
                        // if the value is an array, split up the offset automatically
                        const valAsArray = val as string[];
                        const valLength = valAsArray.length;
                        
                        for (let i = 0; i < valLength; i++) {
                            const offset = i === 0 ? 0 : i === valLength - 1 ? 1 : i / (valLength - 1.0);
                            let keyframe = keyframesByOffset[offset];
                            if (!keyframe) {
                                keyframe = createMap<ja.ICssKeyframeOptions>();
                                keyframesByOffset[offset] = keyframe; 
                            }
                            keyframe[prop] = val[i];
                        }
                    } else {
                        // if the value is not an array, place it at offset 0
                        let keyframe = keyframesByOffset[0];
                        if (!keyframe) {
                            keyframe = createMap<ja.ICssKeyframeOptions>();
                            keyframesByOffset[0] = keyframe;
                        }
                        keyframe[prop] = val;
                    }
                }

                sourceKeyframes = [];
                for (let offset in keyframesByOffset) {
                    const keyframe = keyframesByOffset[offset];
                    keyframe.offset = Number(offset);
                    sourceKeyframes.push(keyframe);
                }
            }
       
            const targetKeyframes: waapi.IKeyframe[] = [];
            const keyframeLength = sourceKeyframes.length;
            
            for (let i = 0; i < keyframeLength; i++) {
                const sourceKeyframe = sourceKeyframes[i];
                let targetKeyframe = createMap<waapi.IKeyframe>();

                for (let propertyName in sourceKeyframe) {
                    if (!sourceKeyframe.hasOwnProperty(propertyName)) {
                        continue;
                    }
                    const sourceValue = sourceKeyframe[propertyName];
                    if (!isDefined(sourceValue)) {
                        continue;
                    }
                    targetKeyframe[propertyName] = unwrap(sourceValue);
                }

                // fixme: replace with mutation instead of copy                
                normalizeProperties(targetKeyframe);
                targetKeyframes.push(targetKeyframe);                
            }

            spaceKeyframes(targetKeyframes);            
            normalizeKeyframes(targetKeyframes);
            
            return new KeyframeAnimator(target, targetKeyframes, timings);
        });

        return animations;
    }
}
