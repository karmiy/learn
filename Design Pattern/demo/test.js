const before = function(fn, beforeFn) {
    return function(...args) {
        beforeFn.apply(this, args);
        return fn.apply(this, args);
    } 
}

const after = function(fn, afterFn) {
    return function(...args) {
        const ret = fn.apply(this, args);
        afterFn.apply(this, args);
        return ret;
    } 
}

document.getElementById = after(document.getElementById, function() {
    console.log(1);
});