type presetMap = { [key: string]: ja.AnimationMixin };

const presets: presetMap = {};

export class MixinService {
    private defs: presetMap = {};
    public findAnimation(name: string): ja.AnimationMixin {
        return this.defs[name] || presets[name] || undefined;
    }
    public registerAnimation(animationOptions: ja.AnimationMixin, isGlobal: boolean): void {
        const name = animationOptions.name;
        if (isGlobal) {
            presets[name] = animationOptions;
            return;
        }
        this.defs[name] = animationOptions;
    }
}
