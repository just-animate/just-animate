import { raf, now } from '../../common';

type TimeLoopCallback = {
    (delta: number, elapsed: number): any;
};

export interface ITimeloop {
    on(fn: TimeLoopCallback): void;
    off(fn: TimeLoopCallback): void;
}

export const timeloop = (): ITimeloop => {
    let isActive: boolean | undefined = undefined;
    let lastTime: number | undefined = undefined;
    const ons: TimeLoopCallback[] = [];
    const offs: TimeLoopCallback[] = [];
    const active: TimeLoopCallback[] = [];
    const elapses: number[] = [];

    const updateOffs = (): void => {
        for (let i = 0, len = offs.length; i < len; i++) {
            const indexOfSub = active.indexOf(offs[i]);
            if (indexOfSub !== -1) {
                active.splice(indexOfSub, 1);
                elapses.splice(indexOfSub, 1);
            }
        }
    };

    const updateOns = (): void => {
        for (let i = 0, len = ons.length; i < len; i++) {
            const fn = ons[i];
            if (active.indexOf(fn) === -1) {
                active.push(fn);
                elapses.push(0);
            }
        }
    };    

    const update = (): void => {
        updateOffs();
        updateOns();

        const len = active.length;
        lastTime = lastTime || now();

        const thisTime = now();
        const delta = thisTime - lastTime;

        // if undefined is subscribed, kill the cycle
        if (!len) {
            // end recursion
            isActive = undefined;
            lastTime = undefined;
            return;
        }

        // ensure running and requestAnimationFrame is called
        isActive = true;
        lastTime = thisTime;
        raf(update);

        for (let i = 0; i < len; i++) {
            // update delta and save result
            const existingElapsed = elapses[i];
            const updatedElapsed = existingElapsed + delta;
            elapses[i] = updatedElapsed;

            // call sub with updated delta
            active[i](delta, updatedElapsed);
        }
    };

    const self = {
        on(fn: TimeLoopCallback): void {
            const offIndex = offs.indexOf(fn);
            if (offIndex !== -1) {
                offs.splice(offIndex, 1);
            }
            if (ons.indexOf(fn) === -1) {
                ons.push(fn);
            }
            if (!isActive) {
                isActive = true;
                raf(update);
            }
        },
        off(fn: TimeLoopCallback): void {
            const onIndex = ons.indexOf(fn);
            if (onIndex !== -1) {
                ons.splice(onIndex, 1);
            }
            if (offs.indexOf(fn) === -1) {
                offs.push(fn);
            }
            if (!isActive) {
                isActive = true;
                raf(update);
            }
        }
    };

    return self;
};
