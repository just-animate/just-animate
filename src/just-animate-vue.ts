/// <reference path="./just-animate.d.ts" />
import { AnimateVue } from './lib/vue';

declare var window: Window & { just: ja.JustAnimate & { AnimateVue: AnimateVue } };

window.just.AnimateVue = new AnimateVue();
