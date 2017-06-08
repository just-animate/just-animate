import { JATimeline } from './core'; 

/**
 * Returns a new timeline of animation(s) using the options provided
 * 
 * @param {(ja.IAnimationOptions | ja.IAnimationOptions[])} options
 * @returns {ja.IAnimator}
 * 
 * @memberOf JustAnimate
 */
export const animate = (options: ja.AnimationOptions | ja.AnimationOptions[]) => new JATimeline().append(options);

export { random, shuffle, splitText } from './utils';
