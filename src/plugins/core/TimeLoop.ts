import {raf, now} from '../../common';

type TimeLoopCallback = {
    (delta: number, elapsed: number): any;
};

const active: TimeLoopCallback[] = [];
const elapses: number[] = [];
const offs: TimeLoopCallback[] = [];
const ons: TimeLoopCallback[] = [];
let isActive: boolean | undefined = undefined;
let lastTime: number | undefined = undefined;

export const timeloop = {
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
            raf(self, update);
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
            raf(self, update);
        }
    }
};

function update(): void {
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
    raf(self, update);

    for (let i = 0; i < len; i++) {
        // update delta and save result
        const existingElapsed = elapses[i];
        const updatedElapsed = existingElapsed + delta;
        elapses[i] = updatedElapsed;

        // call sub with updated delta
        active[i](delta, updatedElapsed);
    }
}

function updateOffs(): void {
    const len = offs.length;

    for (let i = 0; i < len; i++) {
        const fn = offs[i];
        const indexOfSub = active.indexOf(fn);
        if (indexOfSub !== -1) {
            active.splice(indexOfSub, 1);
            elapses.splice(indexOfSub, 1);
        }
    }
}
function updateOns(): void {
    const len = ons.length;

    for (let i = 0; i < len; i++) {
        const fn = ons[i];
        if (active.indexOf(fn) === -1) {
            active.push(fn);
            elapses.push(0);
        }
    }
}
