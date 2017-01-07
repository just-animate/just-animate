/// <reference path="./just-animate.d.ts" />
import * as animations from './animations';
import { JustAnimate } from './JustAnimate';
import { KeyframePlugin } from './plugins/waapi';

declare var window: Window & { just: ja.JustAnimate };
declare var angular: any;

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', JustAnimate);
}

const just = new JustAnimate();
just.inject(Object.keys(animations).map((k: string) => animations[k]));
just.plugins.push(new KeyframePlugin());

window.just = just;
