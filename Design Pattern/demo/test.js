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

Function.prototype.before = function(beforeFn) {
    const _self = this; // 保存原函数引用
    return function(...args) {
        beforeFn.apply(this, args);
        return _self.apply(this, args);
    }
}

const getToken = function() {
    return 'Token';
}
const axios = function(type, url, params = {}) {
    console.log(params);
    // 请求相关操作...
}
const axiosWithToken = axios.before(function(type, url, params = {}) {
    params.token = getToken();
})
axiosWithToken('get', '/query', { key: 'k' });