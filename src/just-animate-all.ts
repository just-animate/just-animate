/// <reference path="./just-animate.d.ts" />
import * as animations from './animations';
import { justAnimate } from './JustAnimate';
import { keyframePlugin } from './plugins/waapi';

declare var window: Window & { just: ja.JustAnimate };

const just = justAnimate();
just.inject(Object.keys(animations).map((k: string) => animations[k]));
just.plugin(keyframePlugin());

window.just = just;
