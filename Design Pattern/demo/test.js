const mult = function(...args) {
    return args.reduce((sum, item) => sum * item);
}

const proxyMult = (function() {
    const cache = {};

    return function(...args) {
        const key = args.join(',');
        if(key in cache) return cache[key];

        return cache[key] = mult.apply(this, args);
    }
}());

proxyMult(1, 2, 3);