## 关于this指向

```js
// 之前提过，this指向的问题
1、谁调用它，this就指向谁
2、没有调用主体，this指向window，严格模式下this是undefined
3、ES6箭头函数本身是没有this的，this指向上下文，当前上下文环境this是谁，箭头函数里this就是谁（本节略过）

// 示例一
function a() {
    console.log(this);
}
a(); // 输出window，没有调用主体，或者说调用主体即window.a()

// 示例二
var wrap = document.getElementById('wrap');
wrap.onclick = function() {
    console.log(this); // this指向wrap，点击的调用主体是wrap
}

// 示例三
var wrap = document.getElementById('wrap');
var box = document.getElementById('box');

wrap.onclick = fn;
box.onclick = fn;

function fn() {
    console.log(this); // 无法确定this指向，会即时指向调用者
}

// 示例四
var a = {
    name : "karmiy",
    func1: function () {
        console.log(this.name)     
    },
    func2: function () {
        setTimeout(  function () {
            this.func1()
        },100);
    }

};
a.func2(); // 输出this.func1 is not a function，因为定时器this指向window，没有调用主体
```
    
## call、apply、bind改变this指向

### call
    
```js
// 参数：第一个实参是函数的this指向，第二个实参对应于函数第一个形参

// 示例一
var wrap = document.getElementById('wrap');
wrap.onclick = function() {
    fn.call(document. 1); // 1、将fn的this指向改为document，形参num传1
}
function fn(num) {
    console.log(num + this.id); // 2、this指向被修改，点击wrap触发时this是document
}

// 示例二
(function(){
    var wrap = document.getElementById('wrap');
    wrap.onclick = function() {
        fn.call(this. 1); 
        // 1、这里this是wrap，又将fn的this指向这个this(wrap)
        // 2、这里推荐写this，而不是fn.call(wrap, 1)，因为会导致闭包产生，
                本来wrap变量在添加完onclick就回收了，这样反而产生闭包回收不了
    }
    function fn(num) {
        console.log(num + this.id); // 3、this指向被修改，点击wrap触发时this是wrap
    }
})();

// 示例三
(function(){
    var wrap = document.getElementById('wrap');
    wrap.onclick = function() {
        fn.call(5. 2); 
        // 1、将fn的this指向5这个数
    }
    function fn(num) {
        console.log(num + this); // 2、this指向被修改，点击wrap触发时this是5
    }
})();
```
    
#### call的原理
    
```js
// 1、自己封装个call函数绑定在function原型上，这样所有函数都能用
Function.prototype.myCall = function() {
    // 2、取第一个参数作为传递的this，没有就取window，赋值给This
    var This = arguments[0] || window;
    // 3、这里this是函数本身，如Fn.myCall({id: 1}, 5, 6)，调用触发时，this会是Fn本身，把Fn存储于This的自定义属性fn上
    This.fn = this;
    // 4、用This调用Fn函数（因为是This调用的，所以到时Fn里的this指向会是This），把剩余参数传递，这里用ES6的扩展运算符，ES5可以用eval编译字符串的方式传递
    This.fn(...[...arguments].slice(1));
    // 5、删除绑定在This的fn属性
    delete This.fn;
}
var Fn = function(a, b) {
    console.log(this);
    console.log(a, b);
}

Fn.myCall({id: 1}, 5, 6)

// 局限性：只能用于引用类型，不能传递如Fn.myCall(1, 5, 6)
```
    
### apply

```js
// 与call的差别
apply的用法和call一样，第一个参数都是this的指向，差别在于第二个参数不同，apply第二个参数是数组

// 示例
function fn(a, b) {
    console.log(this, a, b);
}
fn.apply(document, [5, 6]); //第二个参数传数组，call是(document, 5, 6)
```

### bind

```js
// 兼容性
IE不兼容

// 与call和apply差别
call、apply调用立即执行，bind只是改变this执行，不会自执行

// 用法
var t = {id: 10};
function fn() {
    console.log(this);
}
document.onclick = fn.call(t); // 错误，call会立即执行

document.onclick = fn.bind(t); // 正确，bind不会立即执行，只会提前改变this指向

// 示例一
var a ={
    name : "karmiy",
    fn : function (a, b) {
        console.log(a + b)
    }
}

var b = a.fn;
b.bind(a, 1, 2); // 没有输出，bind只改变this指向不会执行
b.call(a, 1, 2); // 输出3

// 示例二
var a = {
    name : "karmiy",
    func1: function () {
        console.log(this.name)     
    },
    func2: function () {
        setTimeout(function () {
            this.func1()
        }.bind(this),100);
    }

};
a.func2(); // 输出karmiy，bind给setTimeout匿名函数改变this执行，bind(this)的this是a对象，所以里面this.func1()的this会被改变为a对象

// 示例三
function fn(a, b, c) {
    console.log(this, a, b, c);
}
var _fn = fn.bind({id: 1}, 1, 2);
_fn(3); // 输出 {id: 1} 1 2 3，bind的参数会优先传递，_fn的参数紧跟其后
```
    
    