type PresetMap = { [key: string]: ja.AnimationMixin };
const presets: PresetMap = {};

export const mixins = (): IMixinService => {
    const defs: PresetMap = {};

    const self = {
        findAnimation(name: string): ja.AnimationMixin {
            return defs[name] || presets[name];
        },
        registerAnimation(options: ja.AnimationMixin, isGlobal: boolean): void {
            (isGlobal ? presets : defs)[options.name] = options;
        }
    };

    return self;
};

export type IMixinService = {
    findAnimation(name: string): ja.AnimationMixin;
    registerAnimation(animationOptions: ja.AnimationMixin, isGlobal: boolean): void;
};
