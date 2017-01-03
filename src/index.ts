/// <reference path="just-animate.d.ts" />
import * as animations from './animations';
import { justAnimate } from './JustAnimate';
import { keyframePlugin } from './plugins/waapi';

const just = justAnimate();
just.inject(Object.keys(animations).map((k: string) => animations[k]));
just.plugin(keyframePlugin());

export { animations, just };
