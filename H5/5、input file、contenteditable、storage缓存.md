## input file扩展

### accept属性

用来指定浏览器接受的文件类型，打开系统的选择文件弹框的时候，默认界面中呈现的文件类型

accept="image/png"，界面中只限定呈现png图片

accept="image/*"，界面中呈现所有图片，谷歌尽量避免/*，会有卡顿

accept="image/png, image/jpeg"，界面中呈现png和jpg图片

accept="video/*"，界面中呈现视频

accept="audio/*"，界面中呈现音频

accept="text/css"，界面中呈现.css

... (更多MIME 类型列表可网上了解)
    
    // 指定选择.png
    <input id='file' type='file' accept="directory">

![Alt text](./imgs/05-01.png)

    // 指定文件夹
    <input id='file' type='file' webkitdirectory>
    
![Alt text](./imgs/05-02.png)

### capture属性

    适用于移动端开发的：摄像、录音、录像
    
    // 摄像
    <input id='file' type='file' capture="camera">
    
    // 录音
    <input id='file' type='file' capture="microphone">
        
    // 录像
    <input id='file' type='file' capture="camcorder">

## contenteditable可编辑

H5可以对元素添加contenteditable属性使其可编辑
    
    <div id="wrap" contenteditable="true"></div>
    
![Alt text](./imgs/05-03.png)

## 本地存储Storage

### localStorage、sessionStorage

![Alt text](./imgs/05-04.png)

(兼容性 >= IE8，localStorage是永久存储，关闭浏览器也在；sessionStorage是临时存储，浏览器关闭后消失)

### 操作方式

    // 1、存值setItem
    window.localStorage.setItem('login', 'karmiy');
    或
    window.localStorage.login = 'karmiy';
    
        注：value需要是字符串
    
![Alt text](./imgs/05-05.png)
    
    // 2、取值getItem
    console.log(window.localStorage.getItem('login'));
    或
    console.log(window.localStorage.login);
    
    // 3、删除removeItem
    window.localStorage.removeItem('login');
    
    // 4、清空clear
    window.localStorage.clear();
    
### Web Storage与Cookie

    // 1、传递
    cookie在浏览器与服务器间来回传递
    storage不会把数据发送服务器，仅本地保存

    // 2、有效期
    cookie在过期时间前一直有效，即使窗口或浏览器关闭
    sessionStorage在存储数据脚本所在的最顶层窗口（即某个iframe中执行存储sessionStorage操作的情况下，它最顶层的窗口关闭则失效）或浏览器标签关闭时失效
    localStorage永久有效
    
    // 3、存储大小
    cookie不能超过4K
    storage也有大小限制，但可以达到5M或更大
    
    // 4、作用域不同
    cookie在所有同源(URL的协议、端口、主机名三者中有一个不同，就属于不同的文档源)窗口共享
    localStorage在所有同源窗口共享
    sessionStorage不仅需要同源，且需要窗口是顶层页面打开的，如www.a/1.html，超链接打开www.a/2.html这样的2.html才能与1.html共享，直接URL打开www.a/2.html
    则无法共享
    
## Web Worker

### 概述

我们知道，JavaScript使用的是单线程，这意味着前面的任务尚未完成，后面的任务唯有等待

随着计算器的发展，多核CPU的出现，单线程带来的很大的不便，无法充分发挥计算机的计算能力

Web Worker为JavaScript**创建多线程环境**，允许主线程创建Woker线程，主线程运行的同时，Worker线程在后台运行**互不干扰**，等Worker线程完成任务，再把结果返回给主线程

Worker较为耗费资源，不应过度使用，**一旦使用完毕就要关闭**

### Worker线程中的限制内容

#### 同源

Worker线程运行的脚本需要与主线程的脚本同源

#### 对象

Worker线程的全局对象与常规主线程不同，无法读取主线程页面的DOM、document、window、parent，可以使用self、navigator、location
    
#### 通讯

Worker线程与主线程需要通过message通讯的形式完成数据交互

#### 脚本

Worker线程不能执行alert、confirm，可以使用XMLHttpRequest发请求

#### 文件

Worker线程不能读取本地文件(file\://XXX)，它加载的脚本需要来自网络

### 基本用法

![Alt text](./imgs/05-06.png)
    
    // web-worker.html的js部分(主线程)
    const worker = new Worker('./work.js'); // 1、新建worker线程
    worker.postMessage({name: "karmiy"}); // 2、postMessage向worker线程发送信息
    worker.onmessage = function(e) { // 3、onmessage监听worker线程发送过来的数据
        console.log(e.data); // 4、e.data接收数据
    }
    
    // work.js(worker线程)
    self.addEventListener('message', function(e) { // 5、worker线程的全局对象是self，onmessage监听主线程发送过来的数据
        console.log(e.data);
        self.postMessage('This is worker thread')
    })
    
    // 输出
    {name: "karmiy"} (work.js)
    'This is worker thread' (web-worker.html)
    
    注：
        1、worker线程的脚本需来自网络，即这个web-worker.html用如webstorm打开是可以的（webstorm会将文件运行在如http://localhost:63342），
           无法在直接打开的file:///C/XXX/web-worker.html使用
        2、self是线程自身，是个全局对象，所以与以下2种写法等价
            this.addEventListener('message', function(e) {
                ...
            })
            addEventListener('message', function(e) {
                ...
            })

### 加载外部脚本

worker线程内部，提供了importScripts方法可以引入外部JS文件，相当于\<script>标签引入

![Alt text](./imgs/05-07.png)
    
    // imports.js(外部JS)
    const code = 99;
    function fn() {
        console.log(code + 1);
    }
    
    // work.js(worker线程)
    self.addEventListener('message', function() {
        importScripts('./imports.js'); // 1、引入imports.js
        fn(); // 2、引入后可以使用外部JS的函数
        console.log(code); // 3、引入后可以使用外部JS的变量
    })
    
    // 输出
    100、99
    
    // 引入多个
    importScripts('./imports.js', './imports2.js');
    
### 错误处理

主线程和worker线程，都可以监听error事件来捕获worker的错误

    // 主线程
    const worker = new Worker('./work.js');
    worker.postMessage({name: "karmiy"});
    worker.onmessage = function(e) {
        console.log(e.data);
    }
    worker.addEventListener('error', function(e) { // 1、主线程监听错误
        console.log(e);
    })
    
    // worker线程
    self.addEventListener('message', function(e) {
        console.log(e.data);
        throw 500; // 2、worker现场抛出500错误
        self.postMessage('This is worker thread')
    })
    self.addEventListener('error', function(e) { // 3、worker现场监听错误
        console.log(e);
    })

    // 输出
    {name: "karmiy"}
    ErrorEvent (worker的onerror处输出)
    ErrorEvent (主线程的onerror处输出)
    Uncaught 500

### 关闭Worker

当worker使用结束后，必须关闭，否则会占用系统资源

    // 主线程
    worker.terminate();
    
    // worker线程
    self.close();
    
### 数据通信与二进制数据

主线程与worker之间的通信内容，可以是文本，也可以是对象

需要注意的是，这种通信是**拷贝关系，而不是传递引用**，即主线程传递一个对象过去后，在worker现场内对其进行修改，不会影响主线程的对象

事实上，通信机制是：先将内容串行化，将串行化的数据发送给worker，再对其进行还原

主线程和worker之间还可以传递二进制数据(File、Blob、ArrayBuffer等)，但是拷贝二进制数据，容易造成性能问题(发送一个几百M的文件)

而Web Worker在postMessage时提供了传递二进制的方式如下

    worker.postMessage(arrayBuffer, [arrayBuffer]); // 这种写法用于传递二进制数据

### 同页面Worker

通常都会把worker单独分离一份JS文件，但如果想和主线程在同一个页面也是可以的
    
    // 方式一
    <body>
        <!-- 单独用个script标签存载worker脚本 -->
        <script type="app/worker" id="worker">
            self.addEventListener('message', function(e) {
                console.log(e.data);
                self.postMessage('This is worker thread');
            })
        </script>
        <script>
            const blob = new Blob([document.getElementById('worker').textContent]);
            const url = window.URL.createObjectURL(blob);
            const worker = new Worker(url);
            worker.postMessage('This is main thread');
            worker.onmessage = function(e) {
                console.log(e.data);
            }
        </script>
    </body>
    
        // 输出：
        'This is main thread'
        'This is worker thread'
        
    // 方式二
    <body>
        <script>
        <!-- worker脚本放置在字符串中 -->
        const workerContent = `
            self.addEventListener('message', function(e) {
                console.log(e.data);
                self.postMessage('This is worker thread');
            })
        `;
        const blob = new Blob([workerContent]);
        const url = window.URL.createObjectURL(blob);
        const worker = new Worker(url);
        worker.postMessage('This is main thread');
        worker.onmessage = function(e) {
            console.log(e.data);
        }
        </script>
    </body>
    
        // 输出：
        'This is main thread'
        'This is worker thread'
        
    // 方式三
    <body>
        <script>
        <!-- worker脚本放置在函数中，转换字符串自执行 -->
        function work() {
            self.addEventListener('message', function(e) {
                console.log(e.data);
                self.postMessage('This is worker thread');
            })
        }
        // toString将函数转换为字符串，并自执行
        const blob = new Blob([`(${work.toString()})()`]);
        const url = window.URL.createObjectURL(blob);
        const worker = new Worker(url);
        worker.postMessage('This is main thread');
        worker.onmessage = function(e) {
            console.log(e.data);
        }
        </script>
    </body>
    
        // 输出：
        'This is main thread'
        'This is worker thread'
        
### Worker线程实现轮询更新

通常为了用户提现更好，我们可能在一些场景中做缓存数据

例如一些可视化图表，后台数据可能是实时变化的，我们需要隔一段时间重新发起请求，在检查到数据发生改变后替换新数据

这时就可以使用worker线程来做这个轮询更新的操作

    // 创建worker
    function workerFactory(fn) {
        const blob = new Blob([`(${fn.toString()})()`]);
        const url = window.URL.createObjectURL(blob);
        const worker = new Worker(url);
        return worker;
    }
    const worker = workerFactory(function () {
        setInterval(async () => {
            const data = await fetch(...)
            self.postMessage(data);
        }, 1000); // 每10s做一次轮询
    })
    worker.onmessage = function({data}) { // 监听每次轮询结果
        console.log(data);
    }
    
### Worker线程内嵌Worker线程

    