/// <reference path="./just-animate.d.ts" />
import { justAnimate } from './JustAnimate';
import { keyframePlugin } from './plugins/waapi';

declare var window: Window & { just: ja.JustAnimate };

const just = justAnimate();
just.plugin(keyframePlugin());

window.just = just;
