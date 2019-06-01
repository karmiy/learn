## Iterator

ES6在内部部署了一个\[Symbol.iterator]属性，它是一个函数，执行后会返回Iterator对象

Iterator是迭代器，是一种机制

它为不同的数据结构提供统一的访问机制。任何数据结构部署了Iterator接口，就可以完成遍历操作

Iterator的作用：

- 为各种数据结构，提供一个**统一简便的访问接口**
- 使得数据结构的成员能够**按某次次序排列**
- 主要供**for ... of**消费

Iterator的本质：

指针对象

谁拥有Iterator：

**Array String NodeList arguments Map Set**


如何访问Iterator：

**XX\[Symbol.iterator]()访问**

- Array：Array Iterator
- String：StringIterator
- NodeList：Array Iterator
- arguments：Array Iterator
- Set：SetIterator 
- Map：MapIterator 

Iterator的应用：

    // 示例一
    const arr = [1, 2, 3, 4];
    const arr_iterator = arr[Symbol.iterator]();
    console.log(arr_iterator); // Array Iterator {}，是Iterator接口
    
    // 示例二（next）
    const arr = [1, 2, 3, 4];
    const arr_iterator = arr[Symbol.iterator]();
    arr_iterator.next(); // {value: 1, done: false} // 返回对象，包含value、done2个属性，value代表当前迭代的值，done表示是否迭代结束
    arr_iterator.next(); // {value: 2, done: false}
    arr_iterator.next(); // {value: 3, done: false}
    arr_iterator.next(); // {value: 4, done: false}
    arr_iterator.next(); // {value: undefined, done: true}
    
    // 示例三（for ... of）
    const arr = [1, 2, 3, 4];
    for(let item of arr.entries()) { // 前面提过Array.prototype.entries返回的是Iterator接口
        console.log(item); // 依次输出[0, 1]、[1, 2]、[2, 3]、[3, 4]
    }
    for(let item of Object.entries(arr)) { // Object.entries返回的是数组，而数组拥有Iterator接口，所以可以for ... of遍历
        console.log(item); // 依次输出['0', 1]、['1', 2]、['2', 3]、['3', 4]
    }
    
        注：
            1、for ... of首先会看遍历是是否是Iterator接口，不是则通过[Symbol.iterator]()去获取
            2、循环调用Iterator接口的next方法，实现遍历
            
    // 示例四（遍历Set、Map）
    const set = new Set([1, 2, 3, 3, 4]);
    console.log(set[Symbol.iterator]()); // SetIterator {1, 2, 3, 4}
    for(let item of set) {
        console.log(item); // 依次输出1、2、3、4
    }
    
    const map = new Map([['id', 100], ['name', 'karmiy']]);
    console.log(map[Symbol.iterator]()); // MapIterator {"id" => 100, "name" => "karmiy"}
    for(let item of map) {
        console.log(item); // 依次输出['id', 100]、['name', 'karmiy']
    }
    
    // 示例五（遍历字符串）
    const str = 'karmiy';
    console.log(str[Symbol.iterator]()); // StringIterator {}
    for(let item of str) {
        console.log(item); // 依次输出'k'、'a'、'r'、'm'、'i'、'y'
    }
    
    // 示例六（遍历对象）
    const obj = {
        id: 100,
        name: 'karmiy',
    }
    for(let item of obj) {
        console.log(item); // 报错：TypeError: obj is not iterable
    }
    
    解决方式一：给对象手动封装Iterator接口
    const obj = {
        id: 100,
        name: 'karmiy',
        [Symbol.iterator]: function() {
            const arr = [];
            let index = 0, length;
            for(let key in this) {
                arr.push(this[key]);
            }
            length = arr.length;
            return {
                next: function() {
                    const done = index >= length;
                    return {
                        value: arr[index++],
                        done,
                    }
                }
            }
        }
    }
    for(let item of obj) {
        console.log(item); // 依次输出100、'karmiy'
    }
    
    解决方式二：赋值Iterator接口
    const obj = {
        0: 100,
        1: 'karmiy',
        length: 2,
        [Symbol.iterator]: Array.prototype[Symbol.iterator], // 赋值为Array的Iterator接口
    }
    for(let item of obj) {
        console.log(item); // 依次输出100、'karmiy'
    }
    
        注：这次示例也证实了，for ... of是调用Iterator的next进行迭代的
        

