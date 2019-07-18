## Proxy

ES6新增了Proxy，用于修改某些操作的默认行为，**拦截**外界对目标对象访问的一种机制，从而对外界的访问进行过滤和修改，即代理某些操作，也称“**代理器**”

**Vue也从Object.defineProperty实现数据监听，调整为Proxy拦截代理**

### get、set拦截

    // 示例一（get拦截）
    const obj = {
        id: 10,
        name: 'karmiy',
    }
    const p = new Proxy(obj, {
        get(target, key, proxy) {
            console.log(`拦截了取值操作`);
            console.log(target);
            console.log(key);
        },
    });
    p.name; // 输出: '拦截了取值操作'、{id: 10, name: 'karmiy'}、'name'，返回undefined
    
        注：只有使用proxy实例的对象才能使用这些操作，操作obj.name并不会
    
    // 示例二
    const obj = {
        id: 10,
        name: 'karmiy',
    }
    const p = new Proxy(obj, {
        get(target, key, proxy) {
            if(key === 'name')
                return 'karloy';
            return target[key];
        },
    });
    console.log(p.id); // 10
    console.log(p.name); // 'karloy'，拦截get并做了修改
    
    // 示例三（set拦截）
    const obj = {
        id: 10,
        name: 'karmiy',
    }
    const p = new Proxy(obj, {
        set(target, key, value, proxy) {
        },
    });
    p.name = 'karloy';
    console.log(p.name); // 'karmiy'，set没有写内容，赋值失败
    
    // 示例四
    const obj = {
        id: 10,
        name: 'karmiy',
    }
    const p = new Proxy(obj, {
        set(target, key, value, proxy) {
            target[key] = key === 'name' ? value + '先生' : value;
        },
    });
    p.name = 'K';
    p.id = 20;
    console.log(p.name); // 'K先生'
    console.log(p.id); // 20
    
    // 示例五（this）
    const obj = {
        fn() {
            console.log(this);
        }
    }
    const p = new Proxy(obj, {
        get(target, key) {
            return target[key];
        },
    });
    p.fn(); // Proxy {fn: ƒ}，this指向Proxy对象
    
### 拦截操作一览

    1、get(target, propKey, receiver)： 拦截对象属性的读取，比如proxy.foo和proxy\['foo']

        前面已示例过

    2、set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy\['foo'] = v，返回一个布尔值
    
        前面已示例过

    3、has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值
        
        const obj = {id: 100};
        const p = new Proxy(obj, {
            has(target, key) {
                console.log('拦截in操作符');
                console.log(target);
                console.log(key);
                return true;
            }
        });
        'id' in p;
        // 输出：'拦截in操作符'
                 {id: 100}
                 id

    4、deleteProperty(target, propKey)：拦截delete proxy\[propKey]的操作，返回一个布尔值

        const obj = {id: 100, name: 'karmiy'};
        const p = new Proxy(obj, {
            deleteProperty(target, key) {
                if(key === 'name') {
                    console.log('不给删');
                    return;
                }
                delete target[key];
                return true;
            }
        });
        delete p.id; 
        console.log(p); // Proxy {name: "karmiy"}
        delete p.name;  // '不给删'
        console.log(p); // Proxy {name: "karmiy"}

    5、ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性
        
        const obj = {id: 100, name: 'karmiy'};
        const p = new Proxy(obj, {
            ownKeys(target) {
                return ['id']; // 只返回属性名'id'
            }
        });
        Object.keys(p); // ['id']
        
    6、getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象

        const obj = {id: 100, name: 'karmiy'};
        const p = new Proxy(obj, {
            getOwnPropertyDescriptor(target, key) {
                if(key === 'name') {
                    return;
                }
                return Object.getOwnPropertyDescriptor(target, key);
            }
        });
        Object.getOwnPropertyDescriptor(proxy, 'name'); // undefined
        Object.getOwnPropertyDescriptor(proxy, 'id'); // {value: 100, writable: true, enumerable: true, configurable: true}

    7、defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值(严格模式下返回 false 会抛 TypeError)
        
        const obj = {id: 100, name: 'karmiy'};
        const p = new Proxy(obj, {
            defineProperty (target, key,desc) {
                Reflect.defineProperty(target, key, desc);
                return true;
            }
        });
        Object.defineProperty(p, 'code', {
            configuralble: true,
            value: '001'
        });
        console.log(p); // Proxy {id: 100, name: "karmiy", code: "001"}
        
        注1：如果对象不可拓展，将不能添加属性
        const obj = {id: 100, name: 'karmiy'};
        Object.preventExtensions(obj);
        const p = new Proxy(obj, {
            defineProperty (target, key,desc) {
                Reflect.defineProperty(target, key, desc);
                return true;
            }
        });
        Object.defineProperty(p, 'code', {
            configuralble: true,
            value: '001'
        }); 
        // 报错TypeError: 'defineProperty' on proxy: trap returned truish for adding property 'code'........
        
        注2：添加一个不可配置属性或将原本的可配置属性改为不可配，都会报错
        const obj = {id: 100, name: 'karmiy'};
        const p = new Proxy(obj, {
            defineProperty (target, key,desc) {
                return true;
            }
        });
        Object.defineProperty(p, 'code', {
            configurable: false,
            value: '001'
        }); // 报错...
        或
        Object.defineProperty(p, 'code', {
            configurable: false,
            id: '200'
        }); // 报错...
        
    8、preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值
        
        注：只有Object.isExtensible(proxy)为false，即不可扩展时，proxy.preventExtensions才能返回true，否则报错
        
        const obj = {id: 100};
        const p = new Proxy(obj, {
            preventExtensions(target, key,desc) {
                return true;
            }
        });
        Object.preventExtensions(p); // 报错
        
        解决：
        const obj = {id: 100};
        const p = new Proxy(obj, {
            preventExtensions(target, key,desc) {
                Object.preventExtensions(target); // 调用一次Object.preventExtensions;
                return true;
            }
        });
        Object.preventExtensions(p); // Proxy {id: 100}
        
    9、getPrototypeOf(target)：拦截Object.prototype.__proto__、Object.prototype.isPrototypeOf、Object.getPrototypeOf、Reflect.getPrototypeOf、instanceof，返回一个对象
        
        const obj = {id: 100};
        const p = new Proxy(obj, {
            getPrototypeOf (target) {
                return {code: '001'};
            }
        });
        Object.getPrototypeOf(p); // {code: '001'}
        
    10、isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值
        
        const obj = {id: 100};
        const p = new Proxy(obj, {
            isExtensible(target) {
                console.log('isExtensible');
                return true;
            }
        });
        Object.isExtensible(p); // 'isExtensible'
        
    11、setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截
        
        const obj = {id: 100};
        const p = new Proxy(obj, {
            setPrototypeOf(target, key) {
                console.log('不可修改原型');
                return false;
            }
        });
        Object.setPrototypeOf(p, {}); // '不可修改原型'  报错...
        
    12、apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，有三个参数（目标对象本身、对象上下文this、参数数组），比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
    
        const obj = function() {console.log('本来的调用')};
        const p = new Proxy(obj, {
            apply(target, ctx, args) {
                console.log('被拦截的调用');
                console.log(target);
                console.log(ctx);
                console.log(args);
            }
        });
        p(1, 2);
        // 输出：'被拦截的调用'
                 ƒ () {console.log('本来的调用')}
                 undefined
                 [1, 2]
                 
        p.call({id: 1}, 1, 2);
        // 输出：'被拦截的调用'
                 ƒ () {console.log('本来的调用')}
                 {id: 1}
                 [1, 2]
    
    13、construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)
        
        const fn = function(){}
        const p = new Proxy(fn, {
            construct(target, args) {
                console.log(target);
                console.log(args);
                return { value: args[0] + 100 }; // 要返回一个对象，否则会报错
            }
        });
        console.log(new p(1));
        // 输出：ƒ (){}
                 [1]
                 {value: 101}
    
### 取消Proxy实例

使用Proxy.revocale方法取消Proxy实例。

    const target = {};
    const handler = {};
    const {proxy, revoke} = Proxy.revocable(target, handler);
    proxy.foo = 123;
    console.log(proxy.foo); // 123
    
    revoke(); // 取消代理，接下来不能再做代理操作
    console.log(proxy.foo); // TypeError: .... revoked
    delete proxy.foo; // TypeError: .... revoked
    
### Proxy用途

Proxy作为Vue替代Object.defineProperty的新工具，有着巧妙的用途

下面我们以一些用例来知悉Proxy在开发中的一些应用

学习至掘金 [Proxy 的巧用](https://juejin.im/post/5d2e657ae51d4510b71da69d)

#### 设置对象属性默认值

当我们访问一个对象未定义的属性时，通常会返回undefined

我们可以通过Proxy来实现对象属性的默认值，如访问obj.code，当obj没有code这个键时，返回0

    const withZeroValue = (target, zeroValue) => new Proxy(target, {
        get: (obj, prop) => (prop in obj) ? obj[prop] : zeroValue
    })
    
    const pos = {
        x: 10,
        y: 20,
    }
    
    console.log(pos.x, pos.y, pos.z); // 10 20 undefined
    
    const _pos = withZeroValue(pos, 0);
    
    console.log(_pos.x, _pos.y, _pos.z); // 10 20 0

    类似这种，获取坐标点，我们希望某个坐标没有值时，返回0，用Proxy可以这样实现它
    
#### 负索引数组

通常一个数组如const arr = \[1, 2, 3]，我们想返回它的最后一项时，需要使用arr\[arr.length - 1]来访问

我们更希望通过arr\[-1]来获取数组的最后一项

    const negativeArray = (els) => new Proxy(els, {
        get: (target, propKey, receiver) => Reflect.get(target,
            (+propKey < 0) ? String(target.length + +propKey) : propKey, receiver)
    });
    
    const arr = negativeArray([1, 2, 3]);
    console.log(arr[-1]); // 3
    
#### 对象的私有属性

通常我们想让一个对象拥有私有属性，会以Symbol作为键

但是Object.getOwnPropertySymbols的存在使得Symbol的键也并不是不可访问的

或者我们可以使用_下划线来标志私有属性，但这些始终不是真正的私有

我们可能使用Proxy来更好的创建拥有私有属性的对象
    
    // 监听has、ownKeys、get
    // has拦截in操作符，过滤掉以_下划线开头的属性
    // ownKeys拦截Object.getOwnPropertyNames等Object方法，过滤掉非Symbol和以_下划线开头的属性
    const hide = (target, prefix = '_') => new Proxy(target, {
        has: (obj, prop) => (!prop.startsWith(prefix) && prop in obj),
        ownKeys: (obj) => Reflect.ownKeys(obj)
            .filter(prop => (typeof prop !== "string" || !prop.startsWith(prefix))),
        get: (obj, prop, rec) => (prop in rec) ? obj[prop] : undefined
    })
    
    const obj = hide({
        name: 'karmiy',
        _code: '777',
    })
    
    console.log(obj.name); // 'karmiy'
    console.log(obj._code); // undefined
    console.log('_code' in obj); // false
    console.log(Object.keys(obj)); // ['name']
    
#### 限制生存时间

我们可能在获取到一个数据时，会对访问加以限制: 访问有效周期1分钟

那可以使用Proxy在创建一个可以做到此限制的对象

    const ephemeral = (target, ttl = 60000) => {
      const CREATED_AT = Date.now()
      const isExpired = () => (Date.now() - CREATED_AT) > ttl
      
      return new Proxy(target, {
        get: (obj, prop) => isExpired() ? undefined : Reflect.get(obj, prop)
      })
    }
    
    const obj = ephemeral({
        balance: 67.83,
    }, 2000)
    console.log(obj.balance); // 67.83
    setTimeout(() => {
        console.log(obj.balance)  // undefined
    }, 2000)
    
    // 2s后属性访问失效
    
#### 只读视图与枚举视图

    // 只读视图
    const NOPE = () => {
      throw new Error("Can't modify read-only view");
    }
    
    const NOPE_HANDLER = {
      set: NOPE,
      defineProperty: NOPE,
      deleteProperty: NOPE,
      preventExtensions: NOPE,
      setPrototypeOf: NOPE
    }
    
    const readOnlyView = target =>
      new Proxy(target, NOPE_HANDLER)
      
    // 枚举视图
    const createEnum = (target) => readOnlyView(new Proxy(target, {
        get: (obj, prop) => {
            if (prop in obj) {
                return Reflect.get(obj, prop)
            }
            throw new ReferenceError(`Unknown prop "${prop}"`)
        }
    }))
    
    // 示例
    const SHIRT_SIZES = createEnum({
      S: 10,
      M: 15,
      L: 20
    })
    
    console.log(SHIRT_SIZES.S); // 10
    
    SHIRT_SIZES.S = 15; // Uncaught Error: Can't modify read-only view
    
    SHIRT_SIZES.XL; // Uncaught ReferenceError: Unknown prop "XL"

#### 运算符重载

in操作符用于检查指定的属性是否位于指定的对象或其原型链中

我们可以用Proxy重载in操作符，来实现判断一个数字是否在一个数值区间内
    
    // has拦截in操作符，判断是否在区间内
    const range = (min, max) => new Proxy(Object.create(null), {
      has: (_, prop) => (+prop >= min && +prop <= max)
    })
    
    const x = 10;
    if(x in range(1, 100)) {
        console.log('在1~100内');
    }
    
#### 操作Cookie

我们知道，需要操作Cookie，需要使用document.cookie

它的返回值是以分号;拼接的字符串，需要额外去进行分割

我们可以使用Proxy来处理cookie，在内部完成这些操作

    const getCookieObject = () => {
        const cookies = document.cookie.split(';').reduce((cks, ck) => 
    	({[ck.substr(0, ck.indexOf('=')).trim()]: ck.substr(ck.indexOf('=') + 1), ...cks}), {});
        const setCookie = (name, val) => document.cookie = `${name}=${val}`;
        const deleteCookie = (name) => document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    
        return new Proxy(cookies, {
    	set: (obj, prop, val) => (setCookie(prop, val), Reflect.set(obj, prop, val)),
            deleteProperty: (obj, prop) => (deleteCookie(prop), Reflect.deleteProperty(obj, prop))
         })
    }
    
    const cookie = getCookieObject();
    
    cookie.k = 'karmiy';
    cookie.code = '0373';
    
    console.log(cookie.k); // 'karmiy'
    console.log(cookie.code); // '0373'
    
    delete cookie.code;
    console.log(cookie.code); // undefined
    
        // 注：不过用Proxy来代理Cookie，无法设置expires等属性，会是持久化的cookie
