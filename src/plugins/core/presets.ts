type presetMap = { [key: string]: ja.AnimationMixin };

const presets: presetMap = {};

export const findAnimation = (name: string): ja.AnimationMixin => presets[name] || undefined;
export const registerAnimation = (animationOptions: ja.AnimationMixin): void => {
    presets[animationOptions.name] = animationOptions;
};
