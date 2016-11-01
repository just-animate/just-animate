/// <reference path="./just-animate.d.ts" />
import { JustAnimate } from './JustAnimate';
import { KeyframePlugin } from './plugins/waapi/KeyframePlugin';
import { ANIMATE_CSS } from './animations';

declare var window: Window & { just: ja.JustAnimate };
declare var angular: any;

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', JustAnimate);
}

const just = new JustAnimate();
just.inject(ANIMATE_CSS);
just.plugins.push(new KeyframePlugin());

window.just = just;
