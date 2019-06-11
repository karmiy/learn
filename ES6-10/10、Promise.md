## Promise

### 基本概念

ES6新增Promise，它是异步编程的一种解决方案，比传统的解决方案callback回调函数更加的优雅，它将回调地狱转变为链式结构，常用来处理各种异步操作
    
    // 说明
    1、Promise构造函数接收回调函数，这个回调函数接收2个参数
        resolve：function类型，成功后手动调用
        reject: function类型，失败后手动调用
    2、new Promise得到一个Promise对象，可以.then调用接收回调里传递的数据
    3、then接收2个参数，分别是成功resolve时会执行的回调、失败reject时会执行的回调
    
    // 基本示例一（成功）
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(99); // 2秒后，手动调用resolve函数，转为成功状态，成功后自动走then函数的第一个回调参数
        }, 2000);
    }).then(data => {
        console.log(data); // 输出99，resolve接收的参数会传给.then的第一个回调接收
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
        console.log(err); // 输出401，reject接收的参数会传给.then的第二个回调接收
    })
    
    注：
    1、new Promise回调里的内容会立即执行，是同步的
        
        即：
        new Promise(() => {
            console.log(1);
        });
        console.log(2);
        会先打印1，再打印2
    
    2、then返回的是全新的Promise对象，所以才可以不断的.then操作
        
        new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            
        }).then(() => {
          
        })...
        
    
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

- promise在pending状态时，无法得知目前进展到哪一阶段（刚开始还是将结束，代码走到了哪）

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

### catch捕获

    // 常规reject捕获失败的做法
    new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(401);
        }, 2000);
    }).then(data => {
        console.log(data);
    }, err => {
        console.log(err);
    })
    这种做法，每次then函数都要写2个回调参数，要是链式.then一直下去，
    每个.then都需要这样写2个回调参数，否则可能会丢失错误捕获，但是这
    么多.then都这样做，非常繁琐与冗余
    
    // 改为catch捕获
     new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(401);
        }, 2000);
     }).then(data => {
        console.log(data);
     }).then(data => {
        console.log(data);
     }).catch(err => {
        console.log(err); // 401
     })
     使用catch替代，链式调用过程中报错，会一直往下找到catch并执行里面的回调，即catch可以
     接收前面全部then的reject错误
     
     // 关于promise内部常规报错
     new Promise((resolve, reject) => {
        throw Error('error');
     }).then(() => {
     
     }).catch(err => {
        console.log('错误：', err); // 错误： Error: error
     });
     console.log(999); // 输出999，不会因为上面Promise报错而不执行
     
        注：Promise内部发生错误时，只存在于promise内部，不影响全局，由自己吞掉，让.then第二个回调参数或.catch来接收错误
     
 ### 关于then的返回值
 
    // 示例一（return 非Promise对象）
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    }).then(() => {
        return 999; // return非Promise对象
    }).then(data => {
        console.log(data); // 999
    })
    
    结论：then返回非Promise对象时，会包装为状态是resolve成功的Promise对象，即上面的例子等价于：
    
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        }).then(() => {
            // return 999;
            return new Promise(resolve => {
                resolve(999);
            })
        }).then(data => {
            console.log(data); // 999
        })
        
    // 示例二（没有return）
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    }).then(() => {
        
    }).then(data => {
        console.log(data); // undefined
    })
    
    结论：then没有返回值时，就是return undefined，所以同上，把undefined封装为resolved状态的Promise对象并返回
    
    // 示例三（return Promise对象）
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    }).then(() => {
        return new Promise((resolve) => {
            // ...没有执行resolve()
        })
    }).then(data => {
        console.log(data); // 不会被输出
    })
    
    结论：then返回Promise对象时，必须resolve或reject来改变状态，否则无法走进下一个then或catch捕获
    
    总结：
        1、then回调没有return，自动return一个resolve(undefined)的Promise对象
        2、then回调return非Promise对象，自动return成一个resolve这个返回值的Promise对象
        3、then回调return是Promise对象，将这个Promise对象作为整个then的返回值，且需要手动resolve/reject才能走进下一个.then
        
### then配合已有函数/API

    // 示例（配合JSON.parse）
    const promise = new Promise(resolve => {
        setTimeout(() => {
            resolve('[1, 2, 3, 4]');
        }, 2000);
    });
    promise.then(JSON.parse) // 以JSON.parse作为参数
            .then(data => {
                console.log(data); // [1, 2, 3, 4]数组
            });
            
    理解：
        我们常规.then回调参数是(data) => {}，它会接收前一个resolve传递的数据作为参数，去执行这个回调
        以JSON.parse作为回调时，它会把接收的数据作为参数传递给JSON.parse执行
        执行后JSON.parse内部应该是return一个对象的
        上面提过，return一个非Promise对象，会被封装成resolve这个返回值的Promise对象
        所以可以下一个.then来接收JSON.parse转换的结果
        
### Promise的执行顺序

    // 须知
    Promise是微任务
    new Promise构造函数里的代码是同步的
    
    // 示例
    console.log(1);
    
    setTimeout(() => {
        console.log(2);
        new Promise(resolve => {
            console.log(4);
            resolve();
        }).then(() => {
            console.log(5);
        })
    })
    new Promise(resolve => {
        console.log(7);
        resolve();
    }).then(() => {
        console.log(8);
    })
    
    setTimeout(() => {
        console.log(9);
        new Promise((resolve) => {
            console.log(11);
            resolve();
        }).then(() => {
            console.log(12);
        })
    })
    
    // 结果
    第一次事件循环：
    // 1
    // 7
    // 8
    
    第二次事件循环：
    // 2
    // 4
    // 5
    
    第三次事件循环：
    // 9
    // 11
    // 12
    
    // 分析
    1、进入第1次事件循环，执行script主线程代码（主线程也是宏任务），出输出1，Promise构造函数内是同步代码，输出7
    2、遇到两个setTimeout标记为 'A'、'B' 放入队列宏任务、一个Promise的.then标记为 'a' 放入队列微任务
    3、第1次事件循环的宏任务执行完毕，执行余下所有微任务，即 'a'，输出8，第1次事件循环完毕
    4、进入第2次事件循环，发现有宏任务 'A'，输出2，里面有个Promise，构造函数是同步的，输出4，接着把这个Promise的.then放入微任务，标记为 'b'
    5、第2次事件循环的宏任务执行完毕，执行余下所有微任务，即 'b'，输出5，第2次事件循环完毕
    6、进入第3次事件循环，发现有宏任务 'B'，输出9，里面有个Promise，构造函数同步输出11，接着把这个Promise的.then放入微任务，标记为 'c'
    7、第3次事件循环的宏任务执行完毕，执行余下所有微任务，即 'c'，输出12，第3次事件循环完毕

### finally

ES9新增Promise.prototype.finally

    // 说明
    不管是成功resolved，还是失败reject，有时可能都要执行同样内容的代码
    这样在.then与.catch都写上就显得非常冗余
    这时就可以只用.finally，不论是成功还是失败，都会去执行它
    finally不接收参数，与状态无关
    
    // 示例
    const promise = new Promise(resolve => resolve(1));
    
    promise.then(data => {
        console.log(data); // 1
        return new Promise((resolve, reject) => reject(2));
    })
    .catch(err => {
        console.log(err); // 2
    })
    .finally(() => {
        console.log(3);
    })

### Promise静态方法

#### Promise.race

    // 说明
    接收一个数组，数组里是Promise对象，包装成一个新的Promise对象
    只要有一个Promise对象改变状态，Promise.race的状态随之改变
    
    // 示例一
    const p1 = new Promise(resolve => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
    })
    const p2 = new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, 5000);
    })
    Promise.race([p1, p2]).then(data => console.log(data))
    
    // 1秒后，输出1，因为p1状态先改变了，Promise.race状态随之改变
    
    // 示例二
    const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1);
        }, 1000);
    })
    const p2 = new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, 5000);
    })
    Promise.race([p1, p2]).catch(err => console.log(err))
    
    // 1秒后，输出1
    
    // 示例三
    const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1);
        }, 1000);
    })
    const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(2);
        }, 5000);
    })
    Promise.race([p1, p2]).catch(err => console.log(err))
    
    // 1秒后，输出1
    
#### Promise.all

    // 说明
    与Promise.race相反，需要全部状态都改变了，状态才会改变
    接收数组所有Promise实例的传递值，整合为一个数组
    有一个状态reject，Promise.all的实例状态也为reject，且立即执行catch
    
    // 示例一
    const p1 = new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
    const p2 = new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 5000);
    })
    Promise.all([p1, p2]).then(data => console.log(data))
    
    // 5秒后，输出[undefined， undefined]
    
    // 示例二
    const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
    })
    const p2 = new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, 5000);
    })
    Promise.all([p1, p2]).then(data => console.log(data))
    
    // 5秒后，输出[1， 2]
    
    // 示例三
    const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1);
        }, 1000);
    })
    const p2 = new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, 5000);
    })
    Promise.all([p1, p2]).catch(err => console.log(err))
    
    // 1秒后，立即输出1，有一个是reject，立即抛出执行catch，且注意：catch接收的是单个数组，不会整合为数组
    
    // 示例四
    const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1);
        }, 1000);
    })
    const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(2);
        }, 5000);
    })
    Promise.all([p1, p2]).catch(err => console.log(err))
    
    // 1秒后，立即输出1，有一个是reject，立即抛出执行catch，不会等p2的reject了
    
    // 应用场景
    极其常用！如Vue初始化时，我们可能会请求多条数据，而一些功能初始化操作，需要等全部请求完成后再执行，
    这时就可以使用Promise.all
    
#### Promise.resolve / reject

    // 说明
    将数组转为状态为resolve/reject的Promise对象
    
    // 示例一
    const promise = Promise.resolve(123);
    
    等价于：
    
    const promise = new Promise(resolve => {
        resolve(123);
    })
    
    // 示例二
    const promise = Promise.reject(123);
    
    等价于：
    
    const promise = new Promise((resolve, reject) => {
        reject(123);
    })
    
    // 示例三
    new Promise(resolve => {
        resolve(1);
    }).then(data => {
        return data + 10;
        // 等价于 return Promise.resolve(data + 10);
    }).then(data => {
        console.log(data); // 11
    })