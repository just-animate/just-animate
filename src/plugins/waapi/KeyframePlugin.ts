import {queryElements} from '../../common/elements';
import {createAnimator} from './KeyframeTransformers';

export class KeyframePlugin implements ja.IPlugin {
    public canHandle(options: ja.IAnimationOptions): boolean {
        return !!(options.css);
    }

    public handle(options: ja.IAnimationOptions): ja.IAnimationController[] {
        const targets = queryElements(options.targets) as HTMLElement[];
        const animators: ja.IAnimationController[] = [];
        for (let i = 0, len = targets.length; i < len; i++) {
            animators.push(createAnimator({
                index: i,                
                options: options,
                target: targets[i],
                targets: targets
            }));
        }
        return animators;
    }
}
