export const middlewares: ja.IMiddleware[] = [];

export const use = (middleware: ja.IMiddleware) => {
    if (middlewares.indexOf(middleware) === -1) {
        middlewares.push(middleware);
    }
};
