import {nil} from '../../common/resources';

type presetMap = { [key: string]: ja.IAnimationMixin };

const presets: presetMap = {};

export class MixinService {
    private defs: presetMap = {};
    public findAnimation(name: string): ja.IAnimationMixin {
        return this.defs[name] || presets[name] || nil;
    }
    public registerAnimation(animationOptions: ja.IAnimationMixin, isGlobal: boolean): void {
        const name = animationOptions.name;
        if (isGlobal) {
            presets[name] = animationOptions;
            return;
        }
        this.defs[name] = animationOptions;
    }
}
