export function extend(target: any, ...sources: any[]) {
    for (var i = 1, len = arguments.length; i < len; i++) {
        var source = arguments[i];
        for (var propName in source) {
            if (source.hasOwnProperty(propName)) {
                target[propName] = source[propName];
            }
        }
    }
    return target;
}