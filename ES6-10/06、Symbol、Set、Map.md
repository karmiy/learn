## Symbol

ES6新增的第6种基本数据类型

ES5基础数据类型： undefined、number、string、boolean、null

ES6引入Symbol作为一种新的原始数据类型，表示**独一无二**的值，主要是为了防止属性名冲突

    // 示例一
    const a = Symbol();
    const b = Symbol();
    console.log(a === b); // false，是独立无二的
    
    // 示例二
    console.log(Symbol()); // Symbol()，打印不出来细致内容
    
    // 示例三（typeof）
    console.log(typeof Symbol()); // 'symbol'
    
    // 示例四
    const a = Symbol('karmiy'); // 给Symbol数据加描述
    console.log(a); // Symbol(karmiy)
    
    // 示例五
    const a = Symbol('karmiy');
    a.toString(); // 'Symbol(karmiy)'
    Boolean(a); // true，Symbol在if判断也是true
    Number(a); // 报错：TypeError: Cannot convert a Symbol value to a number
    
    // 示例六
    const a = Symbol('karmiy');
    const obj = {
        [a]: 'Symbol数据',
    }
    console.log(obj); // {Symbol(karmiy): "Symbol数据"}
    console.log(obj[Symbol('karmiy')]); // undefined，Symbol是独一无二的
    console.log(obj[a]); // 'Symbol数据'
    console.log(Object.keys(obj)); // []，Symbol键无法被枚举出来
    
        注：Symbol无法被for...in、for...of、Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()获取
        
    // 示例七（getOwnPropertySymbols）
    const a = Symbol('karmiy');
    const obj = {
        [a]: 'Symbol数据',
    }
    const symbols = Object.getOwnPropertySymbols(obj); // [Symbol(karmiy)]
    console.log(symbols[0] === a); // true
    
    // 示例八（Symbol.for: 用于重复使用一个Symbol值）
    const a = Symbol.for('karmiy');
    const b = Symbol.for('karmiy');
    const c = Symbol('karmiy');
    console.log(a === b); // true，会先去找有没有叫'karmiy'的Symbol，有则取无则建
    console.log(a === c); // false
    
    // 示例九（Symbol.keyFor）
    const a = Symbol.for('karmiy');
    console.log(Symbol.keyFor(a)); // 'karmiy'
    
    const b = Symbol('karmiy');
    console.log(Symbol.keyFor(b)); // undefined
    
    // 其他
    Symbol提供了11种内置对象：
    Symbol.hasInstance
    Symbol.isConcatSpreadable
    Symbol.species
    Symbol.match
    Symbol.replace
    Symbol.search
    Symbol.split
    Symbol.iterator
    Symbol.toPrimitive
    Symbol.toStringTag
    Symbol.unscopables
    
    此处不多做介绍，用的不是很多
    
## Set、Map

ES6新增数据结构

### Set

    // 示例一
    const set = new Set([1, 2, 3, 4]);
    console.log(set); // Set(4) {1, 2, 3, 4}
    console.log(typeof set); // 'object'
    
    // 示例二（不会有重复的值）
    const set = new Set([1, 2, 3, 3, 4, 4]);
    console.log([...set]); // [1, 2, 3, 4]
    
        注：常用于数组去重，JavaScript章的Array常用API有提到，是性能最好的方式之一
        
    // 示例三（size获取长度）
    const set = new Set([1, 2, 3, 3, 4, 4]);
    console.log(set.size); // 4
    
    // 示例四（add、delete、has、clear）
    const arr = [1]
    const set = new Set()
    set.add(1);
    set.add(1);
    set.add(2);
    set.add(NaN);
    set.add(NaN);
    console.log([...set]); // [1, 2, NaN]，也可以检测NaN
    
    set.delete(1);
    set.delete(NaN);
    console.log([...set]); // [NaN]
    
    set.has(2); // true
    
    set.clear();
    console.log([...set]); // []
    
    cosnole.log(arr); // [1]，Set操作不影响原数组
    
    // 示例五（keys、values、entries、forEach）
    keys、values、entries返回都是Iterator对象
    
    const set = new Set(['a', 'b', 'c']);
    for(let item of set.keys()) {
        console.log(item); // 依次输出'a'、'b'、'c'
    }
    for(let item of set.values()) {
        console.log(item); // 依次输出'a'、'b'、'c'
    }
    for(let item of set.entries()) {
        console.log(item); // 依次输出['a', 'a']、['b', 'b']、['c', 'c']
    }
    set.forEach((item, key) => {
        console.log(item, key); // 依次输出'a' 'a'、 'b' 'b'、 'c' 'c'
    })
    
    // 示例六（解构赋值）
    const set = new Set(['a', 'b', 'c', 'd']);
    const [x, y, ...z] = set;
    console.log(x); // 'a'
    console.log(y); // 'c'
    console.log(z); // ['c', 'd']
    
    // 示例七（Interator的next取值）
    const set = new Set(['a', 'b', 'c', 'd']);
    const keys = set.keys();
    keys.next(); // {value: "a", done: false}
    keys.next(); // {value: "b", done: false}
    keys.next(); // {value: "c", done: false}
    keys.next(); // {value: "d", done: false}
    keys.next(); // {value: undefined, done: true}
    
### Map

    // 示例一
    const o = {id: 1};
    const map = new Map([[o, 100], ['name', 'karmiy']]); // 以二维数组为参数，可以以对象作为键
    console.log(map); // Map(2) {{id: 1} => 100, "name" => "karmiy"}
    
        注：键值对形式、键值唯一、任何数据类型都能作为键值
        
    // 示例二（set、get、size、has、delete、clear）
    const map = new Map();
    map.set('id', 100);
    map.set('name', 'karmiy');
    console.log(map.get('id')); // 100
    console.log(map.size); // 1
    
    console.log(map.has('name')); // true
    
    map.delete('name');
    console.log([...map]); // [['id', 100], ['name', 'karmiy']]
    
    map.clear();
    console.log([...map]); // []
    
    // 示例三（keys、values、entries、forEach）
    keys、values、entries返回都是Iterator对象
    const map = new Map([['id', 100], ['name', 'karmiy']]);
    for(let item of map.keys()) {
        console.log(item); // 依次输出'id'、'name'
    }
    for(let item of map.values()) {
        console.log(item); // 依次输出100、'karmiy'
    }
    for(let item of map.entries()) {
        console.log(item); // 依次输出['id', 100]、['name', 'karmiy']
    }
    map.forEach((value, key) => {
        console.log(value, key); // 依次输出100 'id'、'karmiy' 'name'
    })
    
    // 示例四（Map转对象）
    function MapToObj(map) {
        const obj = Object.create(null);
        for(let [k, v] of map) {
            obj[k] = v;
        }
        return obj;
    }
    
    // 示例五（Interator的next取值）
    const map = new Map([['id', 100], ['name', 'karmiy']]);
    const keys = map.keys();
    keys.next(); // {value: "id", done: false}
    keys.next(); // {value: "name", done: false}
    keys.next(); // {value: undefined, done: true}
    