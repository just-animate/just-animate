import {map} from '../../common/lists';
import {unwrap} from '../../common/objects';
import {nil} from '../../common/resources';
import {queryElements} from '../../common/elements';
import {createMap} from '../../common/dict';
import {isDefined} from '../../common/type';
 
// todo: remove these imports as soon as possible
import {normalizeProperties, normalizeKeyframes, spaceKeyframes} from './KeyframeTransformers';
import {KeyframeAnimator} from '../waapi/KeyframeAnimation';

export class KeyframePlugin implements ja.IPlugin {
    public canHandle(options: ja.IAnimationOptions): boolean {
        return !!(options.css || options.keyframes);
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

            const sourceKeyframes = options.keyframes;          
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
