/// <reference path="just-animate.d.ts" />
import * as animations from './animations';
import { JustAnimate } from './JustAnimate';
import { KeyframePlugin } from './plugins/waapi';


const just = new JustAnimate();
just.inject(Object.keys(animations).map((k: string) => animations[k]));
just.plugins.push(new KeyframePlugin());

export { animations, JustAnimate, just };
