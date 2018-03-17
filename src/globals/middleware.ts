import { IMiddleware } from '../types';

const JA = window.JA;

export const middlewares: IMiddleware[] = [];

export const use = (middleware: IMiddleware) => {
    if (middlewares.indexOf(middleware) === -1) {
        middlewares.push(middleware);
    }
};

JA.use = use;
JA.middlewares = middlewares;

declare module '../types' {
    interface JustAnimateStatic {
        middlewares: typeof middlewares;
        use: typeof use;
    }
}
