const linear: ja.IFunc<number> = (x: number) => x;
const SUBDIVISION_EPSILON = 0.0001;

function bezier(n1: number, n2: number, t: number): number {
    return 3 * n1 * (1 - t) * (1 - t) * t
        + 3 * n2 * (1 - t) * (t * t)
        + (t * t * t);
}

export function cubic(p0: number, p1: number, p2: number, p3: number): ja.IFunc<number> {
    if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
        return linear;
    }
    
    return function (x: number): number {
        if (x === 0 || x === 1) {
            return x;
        }

        let start = 0;
        let end = 1;
        let limit = 10;

        while (--limit) {
            const t = (start + end) / 2;
            const xEst = bezier(p0, p2, t);

            if (Math.abs(x - xEst) < SUBDIVISION_EPSILON) {
                return bezier(p1, p3, t);
            }
            if (xEst < x) {
                start = t;
            } else {
                end = t;
            }
        }

        // should not end up here        
        return x;
    };
}
