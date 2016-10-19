export function now(): number {
    return performance && performance.now ? performance.now() : Date.now();
}

export function raf(ctx: any, fn: Function): any {
    const callback = () => { fn(ctx); };
    return requestAnimationFrame
        ? requestAnimationFrame(callback)
        : setTimeout(callback, 16.66);
}
