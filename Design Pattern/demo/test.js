const Event = (function() {
    const subscribers = {};

    const subscribe = function(key, fn) {
        if (!subscribers[key]) subscribers[key] = [];

        subscribers[key].push(fn);
    };
    const publish = function(key, ...args) {
        const fns = subscribers[key];
        if (!fns || fns.length === 0) return false;

        fns.forEach(fn => fn(...args));
    };
    const unsubscribe = function(key, fn) {
        const fns = subscribers[key];
        if (!fns || fns.length === 0) return false;

        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (let l = fns.length - 1; l >= 0; l--) {
                const _fn = fns[l];
                if (_fn === fn) fns.splice(l, 1);
            }
        }
    };
    return {
        subscribe,
        publish,
        unsubscribe,
    }
})();

Event.subscribe('squareMeter88', function(price) { // A 订阅消息
    console.log('价格= ' + price);
});
Event.publish('squareMeter88', 2000000);