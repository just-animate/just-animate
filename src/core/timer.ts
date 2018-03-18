import { Observable } from './observable';

export class Timer extends Observable<number> {
    private time: number;

    public next(n: number) {
        const self = this;
        super.next(n);
        if (self.subs.length) {
            requestAnimationFrame(self.tick);
        }
    }
    public subscribe(fn: ja.IObserver<number>) {
        const self = this;
        if (!self.subs.length) {
            requestAnimationFrame(self.tick);
        }
        return super.subscribe(fn);
    }
    public tick = (timeStamp: number) => {
        const self = this;
        const delta = -(self.time || timeStamp) + (self.time = timeStamp);
        self.next(delta);
    };
}

export const timer = new Timer();
