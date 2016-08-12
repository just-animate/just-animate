import {nil} from '../../common/resources';
import {raf, now} from '../../common/utils';

export function TimeLoop(): ITimeLoop {
    const self = this instanceof TimeLoop ? this : Object.create(TimeLoop.prototype);
    self.active = [];
    self.elapses = [];
    self.isActive = nil;
    self.lastTime = nil;
    self.offs = [];
    self.ons = [];
    return self;
}

TimeLoop.prototype = {
    on(fn: ITimeLoopCallback): void {
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
    },
    off(fn: ITimeLoopCallback): void {
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
};


function update(self: ITimeLoopContext): void {
    updateOffs(self);
    updateOns(self);

    const callbacks = self.active;
    const elapses = self.elapses;
    const len = callbacks.length;

    const lastTime = self.lastTime || now();
    const thisTime = now();
    const delta = thisTime - lastTime;

    // if nil is subscribed, kill the cycle
    if (!len) {
        // end recursion
        self.isActive = nil;
        self.lastTime = nil;
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

function updateOffs(self: ITimeLoopContext): void {
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
function updateOns(self: ITimeLoopContext): void {
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

export interface ITimeLoopCallback {
    (delta: number, elapsed: number): any;
}

export interface ITimeLoop {
    on(fn: ITimeLoopCallback): void;
    off(fn: ITimeLoopCallback): void;
}

interface ITimeLoopContext {
    isActive: boolean;
    lastTime: number;
    ons: ITimeLoopCallback[];
    offs: ITimeLoopCallback[];
    active: ITimeLoopCallback[];
    elapses: number[];
}
