import { JustAnimate } from './JustAnimate';
import { KeyframePlugin } from './plugins/waapi/KeyframePlugin';
import { ANIMATE_CSS } from './animations';
import * as animations from './animations';

const just = new JustAnimate();
just.inject(ANIMATE_CSS);
just.plugins.push(new KeyframePlugin());

export { animations, JustAnimate, just };
