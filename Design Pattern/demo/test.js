const createProxyFactory = function (fn) {
    const cache = {};
    return function (...args) {
        const key = args.join(',');
        if(key in cache) return cache[key];

        return cache[key] = fn.apply(this, args);
    }
};

const mult = function(...args) {
    return args.reduce((sum, item) => sum * item);
}

const add = function(...args) {
    return args.reduce((sum, item) => sum + item);
}

const proxyMult = createProxyFactory(mult);
const proxyAdd = createProxyFactory(add);

console.log(proxyMult(1, 2, 3));
console.log(proxyMult(1, 2, 3));
console.log(proxyAdd(2, 3));
console.log(proxyAdd(2, 3));