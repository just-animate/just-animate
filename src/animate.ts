import { Animator, plugins, registerAnimation } from './plugins/core';
import { keyframePlugin } from './plugins/waapi';

plugins.push(keyframePlugin);

type animateSignature = {
    (options: ja.AnimationOptions | ja.AnimationOptions[]): ja.IAnimator;
    plugins: typeof plugins;
    register: typeof registerAnimation;
};

/**
 * Returns a new timeline of animation(s) using the options provided
 * 
 * @param {(ja.IAnimationOptions | ja.IAnimationOptions[])} options
 * @returns {ja.IAnimator}
 * 
 * @memberOf JustAnimate
 */
export const animate = ((options: ja.AnimationOptions | ja.AnimationOptions[]): ja.IAnimator => {
    return new Animator().animate(options);
}) as animateSignature;

animate.plugins = plugins;
animate.register = registerAnimation;
