const ops: Function[] = [];
let frame: any;

export function scheduler(fn: Function) {
    return () => {
        ops.push(fn);
        frame = frame || setTimeout(nextTick) || 1;
    };
}

export function nextTick() {
    for (let i = 0; i < ops.length; i++) {
        ops[i]();
    }
    frame = ops.length = 0;
}
