const each = function(ary, callback) {
    for (let i = 0, l = ary.length; i < l; i++) {
        if(callback(i, ary[i]) === false) break;
    }
};

each([1, 2, 3], function(i, n) {
    if(i > 1) return false;
    console.log(i, n);
});