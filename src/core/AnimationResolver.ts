import {nothing} from '../helpers/resources';

export function AnimationResolver(): ja.IAnimationResolver {
    const self = this instanceof AnimationResolver ? this : Object.create(AnimationResolver.prototype);
    self.defs = {};
    return self;
}

const animations: { [key: string]: ja.IAnimationPreset } = {};

AnimationResolver.prototype = {
    defs: nothing as { [key: string]: ja.IAnimationPreset },

    findAnimation(name: string): ja.IAnimationPreset {
        return this.defs[name] || animations[name] || nothing;
    },
    registerAnimation(animationOptions: ja.IAnimationPreset, isGlobal: boolean): void {
        if (isGlobal) {
            animations[animationOptions.name] = animationOptions;
            return;
        }
        this.defs[animationOptions.name] = animationOptions;
    }
};
