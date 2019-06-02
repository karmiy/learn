## Generator

ES6新增Generator函数，是一种异步编程解决方案

### 原理：

执行Genenrator函数会返回一个遍历器对象，依次遍历Generator函数内部的每一个状态

通过调用**next**方法，将指针移向下一个状态，直到遇到下一个**yield**表达式（或return语句）为止（即yield是暂停执行，next恢复执行）


### 特征：

- function关键字与函数名之间有一个*号
- 函数体内部使用yield表达式，定义不同的内部状态
- Generator函数不能跟new一起使用

### Generator的用法：

    // 示例一
    function * fn() {
        yield 'karmiy';
        yield 'karloy';
        return 'qiuqiu';
    }
    const a = fn();
    console.log(a.next()); // {value: 'karmiy', done : false}
    console.log(a.next()); // {value: 'karloy', done : false}
    console.log(a.next()); // {value: 'qiuqiu', done : true}
    console.log(a.next()); // {value: undefined, done : true}
    
        注：不能是箭头函数
        
    // 示例二（关于return）
    function * fn() {
        return 1;
    }
    console.log(fn()); // fn {<suspended>}，return值并不能像普通函数那样作为函数执行的返回值
    
    // 示例三（对象里的Generator函数）
    const obj = {
        *fn() {
            yield 'karmiy';
            yield 'karloy';
        }
    }
    const a = obj.fn();
    console.log(a.next()); // {value: 'karmiy', done : false}
    console.log(a.next()); // {value: 'karloy', done : false}
    console.log(a.next()); // {value: undefined, done : true}
    
    // 示例四
    function * fn() {
        console.log('100');
        yield 1;
        console.log('200');
        yield 2;
        console.log('300');
        yield 3;
        console.log('400');
        yield 4;
        console.log('500');
        return 5;
    }
    const a = fn();
    console.log(a.next()); // 100、{value: 1, done : false}
    console.log(a.next()); // 200、{value: 2, done : false}
    console.log(a.next()); // 300、{value: 3, done : false}
    console.log(a.next()); // 400、{value: 4, done : false}
    console.log(a.next()); // 500、{value: 5, done : true}
    console.log(a.next()); // {value: undefined, done : true}
    
    // 示例五
    function * fn() {
        console.log('100');
        const y1 = yield 1; // yield返回的是undefined
        console.log('200');
        yield y1;
    }
    const a = fn();
    console.log(a.next()); // 100、{value: 1, done : false}
    console.log(a.next()); // 200、{value: undefined, done : false}
    console.log(a.next()); // {value: undefined, done : true}
    
    // 示例六
    function test() {
        console.log('test');
        return 999;
    }
    function * fn() {
        console.log('100');
        const y1 = yield test();
        console.log('200');
        yield y1;
    }
    const a = fn();
    console.log(a.next()); // 100、'test'、{value: 999, done : false}
    console.log(a.next()); // 200、{value: undefined, done : false}
    console.log(a.next()); // {value: undefined, done : true}
    
    // 示例七（next的参数）
    function * fn() {
        console.log('100');
        const y1 = yield 1;
        console.log('200');
        yield y1;
    }
    const a = fn();
    console.log(a.next()); // 100、{value: 1, done : false}
    console.log(a.next('karmiy')); // 200、{value: 'karmiy', done : false}，next的参数会作为上一次yield的返回值
    console.log(a.next()); // {value: undefined, done : true}
    
    // 示例八（for ... of）
    function * fn() {
        console.log('100');
        yield 1;
        console.log('200');
        yield 2;
        console.log('300');
        yield 3;
    }
    const a = fn();
    for(let item of a) {
        console.log(item); // 依次输出'100' 1、'200' 2、'300' 3
    }
    
        注：也证明for ... of是用next取值的
        
    // 示例九（解构）
    function * fn() {
        console.log('100');
        yield 1;
        console.log('200');
        yield 2;
        console.log('300');
        yield 3;
    }
    const a = fn();
    const [x, y, z] = a;
    console.log(x, y, z); // 1 2 3
    
        注：说明解构赋值，也是利用iterator的next方法，逐步取值的
    
    // 示例十（Generator.prototype.return）
    return方法用来返回给定的值，并结束遍历Generator函数，如果return方法没有参数，则返回值的value属性为undefined
    function * fn() {
        console.log('100');
        yield 1;
        console.log('200');
        yield 2;
        console.log('300');
        yield 3;
        console.log('400');
        yield 4;
    }
    const a = fn();
    console.log(a.next()); // 100、{value: 1, done : false}
    console.log(a.return(999)); // 200、{value: 999, done : true}
    console.log(a.next()); // {value: undefined, done : true}
    
    // 示例十一（Generator.prototype.throw）
    function * fn() {
        try {
            yield 1;
            yield 2;
        }catch(e) {
            console.log('内部错误', e);
        }
    }
    const a = fn();
    a.next(); // {value: 1, done : false}
    a.throw(100); // '内部错误' 100、{value: undefined, done : true}
    try {
        a.throw(200);
    }catch(e) {
        console.log('外部错误', e); // '外部错误' 200
    }
    
        注：
        1、throw()是将yield表达式替换为一个throw语句，并结束返回{value: undefined, done : true}
        2、return()是将yield表达式替换为一个return语句，如return(200)结束并返回{value: 200, done : true}
        3、next()是将yield表达式替换为一个值，如const r = yield 1, next(100)则是替换为const r = 100
    
    // 示例十二（yield*）
    function * foo() {
        yield 'a';
        yield 'b';
    }
    function * goo() {
        yield 1;
        yield * foo();
        yield 2;
    }
    const a = goo();
    console.log(a.next()); // {value: 1, done : false}
    console.log(a.next()); // {value: 'a', done : false}
    console.log(a.next()); // {value: 'b', done : false}
    console.log(a.next()); // {value: 2, done : false}
    console.log(a.next()); // {value: undefined, done : true}
    
    等同于：
    function * goo() {
        yield 1;
        yield 'a';
        yield 'b';
        yield 2;
    }
    等同于：
    function * goo() {
        yield 1;
        for(let v of foo()) {
            yield v;
        }
        yield 2;
    }
    
### Generator应用场景

#### 异步流控
    
    Generator一般用来整合一个工作流程，使其同步化表达
    
    比如我们做一个列表流程：显示加载中UI -> 请求数据 -> 移除加载中UI
    function showLoadingUI(next) {
        console.log('显示loading');
        // ...
        next();
    }
    function request(next) {
        // 用setTimeout模拟请求
        console.log('开始请求数据');
        setTimeout(() => {
            console.log('请求数据结束');
            const data = [1, 2, 3]; // 设置返回的data
            next(data);
        }, 5000);
    }
    function hiddenLoadingUI(next, data) {
        console.log('获取到的数据为：' + data);
        console.log('隐藏loading');
        // ..
    }
    
    // 流程控制
    function run(fn){
        const gen = fn();
        function next(data) {
            const result = gen.next();
            if (result.done) return;
            result.value(next, data);
        }
        next();
    };
    
    // 工作流程
    function * task() {
        yield showLoadingUI;
        yield request;
        yield hiddenLoadingUI;
    }
    
    // 执行
    run(task);
    
    
    比如我们要做一个异步请求，可以这样写：
    axios.get(url).then(res => {
        const data = JSON.parse(res.data);
        console.log(data);
    });
    
    
    -----
    function * main(v0) {
        const v1 = yield request(v0);
        const v2 = yield request(v1);
        const v3 = yield request(v2);
    }
    
    function request(value) {
        setTimeout(() => {
            
        }, 3000);
    }
    
    function run(fn, v0) {
        const gen = fn(v0);
        function next(value) {
            const result = gen.next(value);
            if (result.done) return;
            next(result);
        }
        next();
    }
    
#### 处理回调地狱
    
    step1(v1, function(v2) {
        step2(v2, function(v3) {
            step3(v3, function(v4) {
                ...
            })
        })
    })
    以上回调地狱：
        step1接收v1执行逻辑 -> 得到v2，把v2传递回调
        回调接收v2，把v2又传给step2执行逻辑 -> 得到v3，把v3传递回调
        回调接收v3，把v3又传给step3执行逻辑 -> 得到v4，把v4传递回调
    
    可以改写如下形式：
    function * fn(v1) {
        const v2 = yield step1(v1);
        const v3 = yield step2(v2);
        const v4 = yield step3(v3);
        ...
    }
    
#### Generator结合Co库

    假设我们的回调地狱还不是同步的，回调里异步操作，我们使用Generator会这么做：
    
    function * fn(r0) {
        const r1 = yield request(r0);
        const r2 = yield request(r1);
        const r3 = yield request(r2);
        return r3;
    }
    function request(value) {
        // 此处先用Promise模拟axios异步请求
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(value + 1);
            }, 2000);
        })
    }
    const it = fn(0);
    const {value, done} = it.next();
    value.then(data => { // data为1
        console.log(data);
        const {value, done} = it.next(data);
        return value;
    }).then(data => { // data为2
        console.log(data);
        const {value, done} = it.next(data);
        return value;
    }).then(data => { // data为3
        console.log(data);
        const {value, done} = it.next(data);
        return value;
    }).then(data => {
        console.log(data); // 3
    })
    
    这样的写法，虽然解决回调地狱，不过也挺复杂的
    
    使用Co库：
    co(fn(0)).then(data=>{
        console.log(data) // 输出3
    })
    
    就显示非常简洁，co帮我们把Generator里的步骤都执行完了
    
    
    自己封装一个Co库：
    function co(it){
        return new Promise((resolve, reject)=>{
            function next(data){
                let { value, done } = it.next(data)
                if(!done){
                    value.then((data)=>{
                        next(data)
                    },reject)
                }else{
                    resolve(value)
                }
            }
            next();
        })
    }