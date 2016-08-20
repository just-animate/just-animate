const global = window;
const requestAnimationFrame = global.requestAnimationFrame;

export const now = (performance && performance.now)
    ? () => performance.now()
    : () => Date.now();

export const raf = (requestAnimationFrame)
    ? (ctx: any, fn: Function) => {
        requestAnimationFrame(() => { fn(ctx); });
    }
    : (ctx: any, fn: Function) => {
        setTimeout(() => { fn(ctx); }, 16.66);
    };
