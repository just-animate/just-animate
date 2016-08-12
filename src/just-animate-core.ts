/// <reference path="./just-animate.d.ts" />
import {JustAnimate} from './JustAnimate';

declare var window: Window & { just: ja.IJustAnimate };
declare var angular: any;

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', JustAnimate);
}

window.just = new JustAnimate();

