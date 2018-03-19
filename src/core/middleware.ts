import { types } from './types';

export const middlewares: types.IMiddleware[] = [];

export const use = (middleware: types.IMiddleware) => {
    if (middlewares.indexOf(middleware) === -1) {
        middlewares.push(middleware);
    }
};
