## window.open

    // 说明
    打开一个窗口
    参数说明：链接、打开位置、窗口配置参数（一般不设置第三个）
    
    // 示例
    window.open('https://www.baidu.com', '_blank'); // 在新窗口打开
    window.open('https://www.baidu.com', '_parent'); // 在父frame打开
    window.open('https://www.baidu.com', '_self'); // 在当前页面打开
    window.open('https://www.baidu.com', '_top'); // 在顶层frame打开
    window.open('https://www.baidu.com', name); // 在新窗口打开，并命名为XX
    
    // 注
    有的浏览器会阻止open，解决方案此处不阐述
    
## window.location.href

    // 说明
    当前页面URL
    
    // 示例
    console.log(window.location.href); // 输出当前页面URL
    window.location.href = 'XXX'; // 改变当前页面URL
    
## toString

    // 说明
    转字符串，很多数据类型都有toString方法
    
    // 示例
    var a = 1;
    console.log(a.toString()); // '1'
    
    var a = true;
    console.log(a.toString()); // 'true'
    
    var a = 'karmiy';
    console.log(a.toString()); // 'karmiy'
    
    var a = [1, 2, 3];
    console.log(a.toString()); // '1,2,3'
    
    var a = function() {var i = 0;}
    console.log(a.toString()); // 'function() {var i = 0;}'
    
    var a = document;
    console.log(a.toString()); // '[object HTMLDocument]'
    
    var a = {id: 1};
    console.log(a.toString()); // '[object Object]'
    
    // 注
    Object上的toString经常被用于作类型判断
    
    // 判断是否是数组
    var toString = Object.prototype.toString;
    
    var isArray = function(value) {
        return toString.call(value) === '[object Array]';
    }
    
    // 判断是否是函数
    var isFunction = function(value) {
        return toString.call(value) === '[object Function]';
    } 
    
    // 判断是否是字符串
    var isString = function(value) {
        return toString.call(value) === '[object String]';
    } 
    
    // 判断是否是布尔值
    var isBoolean = function(value) {
        return toString.call(value) === '[object Boolean]';
    }
    
    // 判断是否是基本对象
    var isObject = function(value) {
        return toString.call(value).toLowerCase() === '[object object]';
    }
    
    // 判断是否是file对象
    var isFile = function(value) {
        return toString.call(value) === '[object File]';
    }
    
    // 判断是否是Blob对象
    var isBlob = function(value) {
        return toString.call(value) === '[object Blob]';
    }
    
## arguments.callee

    // 说明
    得到函数本身，现已不推荐使用，因为访问arguments很昂贵，这是个很大的对象，每次递归调用都需要重新创建，影响性能、影响闭包
    
    // 示例
    function show(n) {
        var arr = [];
        return (function () {
            arr.unshift(n);
            n--;
            if (n != 0) {
                arguments.callee();
            }
            return arr;
        })()
    }
    
    // 替代方案
    function show(n) {
        var arr = [];
        return (function fn() { // 给内部函数一个名字
            arr.unshift(n);
            n--;
            if (n != 0) {
                fn(); // 改为用函数名来调用
            }
            return arr;
        })()
    }
    