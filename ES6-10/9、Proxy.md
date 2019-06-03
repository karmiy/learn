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