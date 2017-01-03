const presets: { [key: string]: ja.AnimationMixin } = {};

export const mixins = (): IMixinService => {
    const defs: typeof presets = {};

    const self = {
        get(name: string): ja.AnimationMixin {
            return defs[name] || presets[name];
        },
        set(options: ja.AnimationMixin, isGlobal: boolean): void {
            (isGlobal ? presets : defs)[options.name] = options;
        }
    };

    return self;
};

export type IMixinService = {
    get(name: string): ja.AnimationMixin;
    set(animationOptions: ja.AnimationMixin, isGlobal: boolean): void;
};
