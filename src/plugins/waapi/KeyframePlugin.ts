import {queryElements} from '../../common/elements';

// todo: remove these imports as soon as possible
import { createAnimator } from './KeyframeTransformers';

export class KeyframePlugin implements ja.IPlugin {
    public canHandle(options: ja.IAnimationOptions): boolean {
        return !!(options.css);
    }

    public handle(options: ja.IAnimationOptions): ja.IAnimationController[] {
        return queryElements(options.targets)
            .map((target: HTMLElement) => createAnimator(target, options));
    }
}
