import { deepCopyObject } from './common/objects';

declare var window: Window & {
    just: ja.JustAnimate & {
        AnimateVue: { install(vue: vuejs.VueStatic): void; }
    }
};

const animateVue = {
    install(vue: vuejs.VueStatic): void {

        vue.directive<{}>('animate', {
            bind(el: Element, binding: {}): void {
                const events = binding['value'];
                const eventListeners = [];
                let player: ja.IAnimator;

                for (let e in events) {
                    const eventName = e;
                    let options = events[eventName];
                    if (typeof options === 'string') {
                        options = {
                            mixins: options,
                            fill: 'both'
                        };
                    }

                    const eventListener = (event: Event): void => {
                        if (player) {
                            player.cancel();
                        }

                        const animationOptions = deepCopyObject(options);
                        animationOptions.targets = event.target;
                        player = just.animate(animationOptions);
                    };

                    eventListeners.push({
                        eventName: eventName,
                        eventListener: eventListener
                    });
                    el.addEventListener(eventName, eventListener);
                }

                el['jaListeners'] = eventListeners;
            },
            unbind(el: Element): void {
                for (const listener of el['jaListeners']) {
                    el.removeEventListener(listener.eventName, listener.eventListener);
                }
            }
        });
    }
};

window.just.AnimateVue = animateVue;
