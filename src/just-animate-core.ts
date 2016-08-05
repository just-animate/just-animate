/// <reference path="./just-animate.d.ts" />

declare var window: Window & { just: ja.IAnimationManager };
declare var angular: any;

import {JustAnimate} from './JustAnimate';

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', JustAnimate);
}

window.just = JustAnimate();
