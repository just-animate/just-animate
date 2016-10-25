import {raf, now} from '../../common/utils';

type TimeLoopCallback = {
    (delta: number, elapsed: number): any;
}

export class TimeLoop {
    public isActive: boolean | undefined;
    public lastTime: number | undefined;
    public ons: TimeLoopCallback[];
    public offs: TimeLoopCallback[];
    public active: TimeLoopCallback[];
    public elapses: number[];

    constructor() {
        const self = this;
        self.active = [];
        self.elapses = [];
        self.isActive = undefined;
        self.lastTime = undefined;
        self.offs = [];
        self.ons = [];
    }

    public on(fn: TimeLoopCallback): void {
        const self = this;
        const offs = self.offs;
        const ons = self.ons;

        const offIndex = offs.indexOf(fn);
        if (offIndex !== -1) {
            offs.splice(offIndex, 1);
        }
        if (ons.indexOf(fn) === -1) {
            ons.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    }
    public off(fn: TimeLoopCallback): void {
        const self = this;
        const offs = self.offs;
        const ons = self.ons;

        const onIndex = ons.indexOf(fn);
        if (onIndex !== -1) {
            ons.splice(onIndex, 1);
        }
        if (offs.indexOf(fn) === -1) {
            offs.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    }
}

function update(self: TimeLoop): void {
    updateOffs(self);
    updateOns(self);

    const callbacks = self.active;
    const elapses = self.elapses;
    const len = callbacks.length;

    const lastTime = self.lastTime || now();
    const thisTime = now();
    const delta = thisTime - lastTime;

    // if undefined is subscribed, kill the cycle
    if (!len) {
        // end recursion
        self.isActive = undefined;
        self.lastTime = undefined;
        return;
    }

    // ensure running and requestAnimationFrame is called
    self.isActive = true;
    self.lastTime = thisTime;
    raf(self, update);

    for (let i = 0; i < len; i++) {
        // update delta and save result
        const existingElapsed = elapses[i];
        const updatedElapsed = existingElapsed + delta;
        elapses[i] = updatedElapsed;

        // call sub with updated delta
        callbacks[i](delta, updatedElapsed);
    }
}

function updateOffs(self: TimeLoop): void {
    const len = self.offs.length;
    const active = self.active;

    for (let i = 0; i < len; i++) {
        const fn = self.offs[i];
        const indexOfSub = active.indexOf(fn);
        if (indexOfSub !== -1) {
            active.splice(indexOfSub, 1);
            self.elapses.splice(indexOfSub, 1);
        }
    }
}
function updateOns(self: TimeLoop): void {
    const len = self.ons.length;
    const active = self.active;

    for (let i = 0; i < len; i++) {
        const fn = self.ons[i];
        if (active.indexOf(fn) === -1) {
            active.push(fn);
            self.elapses.push(0);
        }
    }
}
