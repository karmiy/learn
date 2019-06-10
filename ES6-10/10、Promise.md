## Promise

### 基本概念

ES6新增Promise，它是异步编程的一种解决方案，比传统的解决方案callback回调函数更加的优雅，它将回调地狱转变为链式结构，常用来处理各种异步操作
    
    参数是一个回调函数
    函数接收2个参数
        resolve：function类型，成功后手动调用
        reject: function类型，失败后手动调用
    
    // 基本示例一（成功）
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(99); // 2秒后，手动调用resolve函数，转为成功状态，成功后自动走then函数的第一个回调参数
        }, 2000);
    }).then(data => {
        console.log(data); // 输出99
    }, err => {
        console.log(err)
    })
    
    // 基本示例二（失败）
    new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(401); // 2秒后，手动调用reject函数，转为失败状态，失败后自动走then函数的第二个回调参数
        }, 2000);
    }).then(data => {
        console.log(data);
    }, err => {
        console.log(err); // 输出401
    })
    
### 用法对比
    
    // 请求函数（setTimeout模拟）
    const request = (callback) => {
        setTimeout(() => {
            callback();
        }, 2000);
    }
    
    ---- 传统回调 ----
    
    // 请求依赖：先请求数据1，结束后再请求数据2，依次数据3...
    request(() => {
        request(() => {
            request(() => {
                ...
            })
        })
    })
        存在的问题：依赖关系请求一多，这种回调将形成回调地狱
        
    ---- Promise链式处理 ----
    
    new Promise(resolve => {
        request(resolve);
    }).then(() => new Promise(resolve => {
        request(resolve);
    })).then(() =>  new Promise(resolve => {
        request(resolve);
    }))
    
        优势：转化为链式操作，代码清晰优雅
        
### 特性

**特点：**

- 对象的状态不受外界影响

- 一旦状态改变，就不会再有变化，任何时候都可以得到这个结果

**状态：**

- pending 进行中

- resolved 成功

- rejected 失败

注： 只有异步操作的结果，可以决定当前状态，即对象的状态不受外界改变

**缺点：**

- promise无法取消，一旦新建就会立即执行

- promise内部抛出错误，不会反应到外部

- promise在pending状态时，无法得知目前进展到哪一阶段（刚开始还是将结束）

````````    
    // 如何理解第二个缺点（内部抛出错误，不会反应到外部）
    try {
        const promise = new Promise(resolve => {
            const t = undefined;
            console.log(t.id); // 这样应该会报错，因为undefined.id报错
        })
    }catch(err) {
        console.log(111);
    }
    
    报错：Uncaught (in promise) TypeError: Cannot read property 'id' of undefined
    
    结论：promise对象内部报错，虽然控制台会有报错信息，但并不会被外部捕获（如try catch）
````````    

