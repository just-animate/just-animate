const now = (performance && performance.now) ? () => performance.now() : () => Date.now();
const raf = (window && window.requestAnimationFrame) || ((fn: Function) => setTimeout(fn, 16.66));

export interface ITimeLoopCallback {
    (delta: number, elapsed: number): any;
}

export class TimeLoop {
    private _isRunning: boolean;
    private _lastTime: number;
    private _callbacks: ITimeLoopCallback[];
    private _elapses: number[];

    constructor() {
        this._isRunning = false;
        this._lastTime = undefined;
        this._callbacks = [];
        this._elapses = [];

        this._update = this._update.bind(this);
    }
    
    public subscribe(fn: ITimeLoopCallback): void {
        if (this._callbacks.indexOf(fn) !== -1) {
            return;
        }

        this._callbacks.push(fn);
        this._elapses.push(0);

        if (!this._isRunning) {
            this._isRunning = true;
            raf(this._update);
        }
    }
    public unsubscribe(fn: ITimeLoopCallback): void {
        const indexOfSub = this._callbacks.indexOf(fn);
        if (indexOfSub === -1) {
            return;
        }
        this._callbacks.splice(indexOfSub, 1);
        this._elapses.splice(indexOfSub, 1);
    }
    private _update(): void {
        const callbacks = this._callbacks;
        const elapses = this._elapses;
        const len = callbacks.length;

        const lastTime = this._lastTime || now();
        const thisTime = now();
        const delta = thisTime - lastTime;

        // if nothing is subscribed, kill the cycle
        if (!len) {
            // end recursion
            this._isRunning = false;
            this._lastTime = undefined;
            return;
        }

        // ensure running and requestAnimationFrame is called
        this._isRunning = true;
        this._lastTime = thisTime;
        raf(this._update);

        for (let i = 0; i < len; i++) {
            // update delta and save result
            const existingElapsed = elapses[i];
            const updatedElapsed = existingElapsed + delta;
            elapses[i] = updatedElapsed;

            // call sub with updated delta
            callbacks[i](delta, updatedElapsed);
        }
    }
}
