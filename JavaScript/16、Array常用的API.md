## Array常用的API

Array的API存在着会改变原数组的效果，这在开发中经常引起BUG

```js
var arr = [1, 2, 3, 4];
var newArr = arr.splice(0, 3); // newArr为[1, 2, 3]

// 这波操作是会改变原数组arr的，使得arr变为[4]
// 如果不知道这个API会影响原数组，将arr还当作原来的[1, 2, 3, 4]去使用，肯定会引发很多BUG
```
    
我们将以是否改变原数组去划分API


### 会改变原数组的API

#### length

```js
// 说明
获取或设置数组的长度

// 示例
var arr = [1, 2, 3, 4, 5];
console.log(arr.length); // 5

arr.length = 2; // 将数组arr长度改为2
console.log(arr); // [1, 2]，原数组被改变，只剩前2位

arr.length = 5; // 将数组arr长度再改为5
console.log(arr); // [1, 2，empty * 3]，后面填充的是undefined

arr[7] = 7;
console.log(arr.length); // 8
console.log(arr); // [1, 2, empty * 5, 7]，中间部分也会用undefined填充

// 其他应用场景
清空数组： arr.length = 0;（保持引用不变）
```
    
#### push

```js
// 说明
向后新增项

// 示例
var arr = [1, 2, 3];
arr.push(4);
console.log(arr); // [1, 2, 3, 4]
arr.push(5, 6, 7); // [1, 2, 3, 4, 5, 6, 7]，可以多个参数
```
    
#### unshift

```js
// 说明
向前新增项

// 示例
var arr = [1, 2, 3];
arr.unshift(0);
console.log(arr); // [0, 1, 2, 3]
arr.unshift(-2, -1); // [-2, -1, 0, 1, 2, 3]，可以多个参数
```

#### pop

```js
// 说明
删除并返回最后一项

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var last = arr.pop();
console.log(last); // 6
console.log(arr); // [1, 2, 3, 4, 5]
```
    
#### shift
    
```js
// 说明
删除并返回第一项

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var first = arr.shift();
console.log(first); // 1
console.log(arr); // [2, 3, 4, 5, 6]
```
    
### splice

```js
// 说明
参数：从第几位开始   删除几个    用什么替代

// 示例一
var arr = [1, 2, 3, 4, 5, 6];
var d_arr = arr.splice(2, 1, 0);
console.log(d_arr); // [3]
console.log(arr); // [1, 2, 0, 4, 5, 6] 

// 示例二
var arr = [1, 2, 3, 4, 5, 6];
var d_arr = arr.splice(2, 3, 0);
console.log(d_arr); // [3, 4, 5]
console.log(arr); // [1, 2, 0, 6] 

// 示例三
var arr = [1, 2, 3, 4, 5, 6];
arr.splice(2, 1, 10, 11, 12); // 可以多个元素替代
console.log(arr); // [1, 2, 10, 11, 12, 4, 5, 6]

// 其他应用场景
在指定位置插入元素：
var arr = [1, 2, 3, 4, 5, 6];
arr.splice(2, 0, 999); // 在第2位插入一个元素999
console.log(arr); // [1, 2, 999, 3, 4, 5, 6]
```

#### sort 

```js
// 说明
对数组进行排序，可以接收一个函数，返回原数组

// 示例一（默认根据字符串的字母的ASCII码进行排序，先比较第一个字母，一样则比较第二个，以此类推）
// ASCII码：数字 < 大写字母 < 小写字母

var arr = [2, 10, 8, 3];
arr.sort();
console.log(arr); // [10, 2, 3, 8]，因为字符'1'比字符'2'的ASCII码小，所以10排在2前面

var arr = ['Google', 'apple', 'Microsoft'];
var result = arr.sort();
console.log(arr); // ['Google', 'Microsoft', 'apple']，因为小写字母的ASCII码在大写字母后面
console.log(arr === result); // true，返回值是原数组

// 示例二
var arr = [5, 7, 9, 8, 4, 10, 1];
arr.sort(function(a, b) {
    return a-b;
});
console.log(arr); // [1, 4, 5, 7, 8, 9, 10]，return a-b为升序

var arr = [5, 7, 9, 8, 4, 10, 1];
arr.sort(function(a, b) {
    return b-a;
});
console.log(arr); // [10, 9, 8, 7, 5, 4, 1]，return b-a为降序

// 示例三
var arr = [5, 7, 9, 8, 4, 10, 1];
arr.sort(function(a, b) {
    return 1;
});
console.log(arr); // [1, 10, 4, 8, 9, 7, 5]，return 正数为倒序

// 示例四
var arr = [5, 7, 9, 8, 4, 10, 1];
arr.sort(function(a, b) {
    return Math.random() - 0.5;
});
console.log(arr); // 实现随机排序

// 示例五
var arr = [{id: 3}, {id: 10}, {id: 7}, {id: 4}, {id: -5}];
arr.sort(function(a, b) {
    return a.id - b.id;
});
console.log(arr); // [{id: -5}, {id: 3}, {id: 4}, {id: 7}, {id: 10}]，按对象属性升序

    
// 示例六
var arr = ['Google', 'apple', 'Microsoft'];
arr.sort(function (a, b) {
    return a > b; // 相当于对比数字时a - b升序做法
});
console.log(arr); // ['Google', 'Microsoft', 'apple']

// 示例七
先按name排序，如果相同，再按id排序
var arr = [
    {id: 3, name: 'karmiy'},
    {id: 10, name: 'karloy'},
    {id: 7, name: 'karmiy'},
    {id: 4, name: 'karloy'},
    {id: -5, name: 'karloy'}
];

arr.sort((a, b) => {
    if(a.name === b.name) {
        return a.id - b.id;
    }
    return a.name > b.name;
})
console.log(arr);
/*
    [
        { id: -5, name: 'karloy' },
        { id: 4, name: 'karloy' },
        { id: 10, name: 'karloy' },
        { id: 3, name: 'karmiy' },
        { id: 7, name: 'karmiy' }
    ]
*/
```
    
#### reverse

```js
// 说明
数组倒序排列，返回原数组

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var result = arr.reverse();
console.log(arr); // [6, 5, 4, 3, 2, 1]
console.log(result === arr); // true，返回原数组
```

    
### 不会改变原数组的API

#### indexOf

```js
// 说明
查找元素位置，参数：查找的元素、从第几位开始找

// 示例
var arr = [1, 2, 3, 4, 5, 6];
console.log(arr.indexOf(4)); // 3
console.log(arr.indexOf(10)); // -1,找不到返回-1
console.log(arr.indexOf(4, 4)); // -1，从第4位开始找

var obj = {id: 321};
var arr = [1, 2, obj, 4, 5];
console.log(arr.indexOf(obj)); // 2 
```
    
#### join
    
```js
// 说明
数组按指定字符拼接为字符串

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var result = arr.join(',');
console.log(result); // '1,2,3,4,5,6'

// 常见面试：问怎么把'abc'变成'c,b,a'
var s = 'abc';
console.log(s.split('').reverse().join(','));
```
    
#### concat

```js
// 说明
数组拼接

// 示例
var arr = [1, 2, 3];
var brr = [4, 5, 6];
console.log(arr.concat(brr)); // [1, 2, 3, 4, 5, 6]
console.log(arr); // [1, 2, 3]，不会改变原数组arr
console.log(brr); // [4, 5, 6]，不会改变原数组brr

var arr = [1, 2, 3];
var brr = [4, 5, 6];
var crr = [7, 8, 9];
console.log(arr.concat(brr, crr)); // 可以多个数组一起拼接

// concat 参数为一个值或数据，且可以磨平第一层数组
var arr = [1, 2, 3];
var brr = [4, 5, 6];
console.log(arr.concat(brr, 7, 8, [9, 10], [11, [12, 13]]));
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, [12, 13]]，一层数组都被磨平了

// ES6 扩展运算符拼接数组
var arr = [1, 2, 3];
var brr = [4, 5, 6];
console.log([...arr, ...brr]); // [1, 2, 3, 4, 5, 6]
```
    
#### slice

```js
// 说明
切割数组，与字符串的slice类似
参数说明：起始序号（包含），终止序号（不包含）

// 示例
var arr = [1, 2, 3, 4, 5, 6];
console.log(arr.slice(1, 3)); // [2, 3]
console.log(arr); // [1, 2, 3, 4, 5, 6]，不改变原数组

console.log(arr.slice(1)); // [2, 3, 4, 5 ,6]，没有第二个参数切割到最后
console.log(arr.slice(2, 0)); // []
console.log(arr.slice(-4, 5)); // [3, 4 ,5]
console.log(arr.slice(1, -2)); // [2, 3, 4]
console.log(arr.slice()); // [1, 2, 3, 4, 5, 6];

// 总结（与String的slice一样）
没有第二个参数，则切割到最后；
参数为负数，相当于s.length-x，如(-3, -2)相当于(s.length - 3, s.length -2)
两个参数大小相反，返回空数组
没有参数返回原数组

// 其他应用场景
把伪数组转数组：
var oPs = document.querySelectorAll('p');
oPs.forEach(...); // 错误，oPs是伪数组，没有forEach这个方法

[].slice.call(oPs).forEach(...); // 正确，利用call与slice将伪数组转为数组
```
    
#### forEach

```js
// 说明
遍历数组
参数说明：forEach(callback、thisValue)
callback回调函数参数：current当前值、index当前序号、arr原数组。一般只用前2个参数
thisValue：callback中的this指向，一般也用不到


// 示例
var arr = [1, 2, 3, 4, 5, 6];
arr.forEach(function(item, index) {
    console.log(item, index, this);
}, {id: 6}); 
/*
    输出：
    1 0 {id: 6}
    2 1 {id: 6}
    3 2 {id: 6}
    4 3 {id: 6}
    5 4 {id: 6}
    6 5 {id: 6}
*/
     
// 注
forEach不能通过return、break跳出循环
```
     
#### map

```js
// 说明
遍历并返回新数组
参数与forEach相同

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var newArr = arr.map(function(item, index) {
    return item * item;
}); 
console.log(newArr); // [1, 4, 9, 16, 25, 36]
```
    
#### filter

```js
// 说明
过滤并返回新数组
参数与forEach相同

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var newArr = arr.filter(function(item, index) {
    return item > 3;
}); 
console.log(newArr); // [4, 5, 6]

// 使用filter去重
var arr = [1, 2, 3, 4, 5, 4, 6, 2, 3];
var newArr = arr.filter((item, i, self) => item && self.indexOf(item) === i);
console.log(newArr);
```
    
#### every

```js
// 说明
判断数组每一项是否都符合条件，是则返回true，反之false
参数与forEach相同

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var result = arr.every(function(item, index) {
    return item > 0; // 是否每一项都大于0
}); 
console.log(result); // true
```
    
#### some

```js
// 说明
判断数组是否存在一项符合条件，是则返回true，反之false
参数与forEach相同

// 示例
var arr = [1, 2, 3, 4, 5, 6];
var result = arr.some(function(item, index) {
    return item > 5; // 是否每一项都大于0
}); 
console.log(result); // true

// 注
some是性能最好的，因为它找到了条件符合项就停止遍历了
```
    
#### reduce

```js
// 说明
对累加器和数组中的每个元素（从左到右）应用一个函数，将其简化为单个值

参数说明：
callback（回调接收4个参数）：
    1、accumulator 累加器加回调的返回值
    2、currentValue 当前数组正在处理的元素
    3、currentIndex 数组中正在处理的当前元素的索引，可选
    4、array 数组本身，可选
    
initialValue：初始值，可选
    
// 示例一，数字求和
var arr = [1, 2, 3, 4, 5, 6];
var total = arr.reduce(function(sum, current) {
    return sum + current;
}, 0);
console.log(total); // 21
    
// reduce回调的流程：
第一次：如果有初始值，先将初始值和数组第1项给回调的参数，没有则把数组第1、2项给回调参数；
第二次：上一个的返回值和数组的下一项给回调参数；
。。。
    
sum         current     返回
0           1           1
1           2           3
3           3           6
6           4           10
10          5           15
15          6           21
    
// 示例二，聚合对象
var arr = [{
    id: 1,
    type: 'A',
    total: 3
}, {
    id: 2,
    type: 'B',
    total: 5
}, {
    id: 3,
    type: 'C',
    total: 7
}];
var result = arr.reduce(function(res, current) {
    res[current.id] = {
        type: current.type,
        total: current.total,
    };
    return res;
}, {});
console.log(result);
/*
    {
        1: {type: 'A', total: 3},
        2: {type: 'B', total: 5},
        3: {type: 'C', total: 7},
    }
*/
```
> 注：reduce 方法不能用于空数组，除非有 initialValue 参数
    
## Array的去重

这里提供一些性能较好的方法

```js
// 以10W条数据为例
const arr = [];
for (let i = 0; i < 100000; i++) {
    arr.push(0 + Math.floor((100000 - 0 + 1) * Math.random()))
}

// 1、先对数组排序，再进行元素比较
// 130ms左右
function unique(arr) {
    const _arr = [];
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr[i + 1]) {
        _arr.push(arr[i]);
    }
    }
    return _arr;
}

或---------------

// 150ms左右
function unique(arr) {
    const _arr = [];
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== _arr[_arr.length - 1]) {
            _arr.push(arr[i]);
        }
    }
    return _arr;
}

// 2、reduce去重
// 140ms左右
function unique(arr) {
    return arr.sort().reduce((init, current) => {
        if(init.length === 0 || init[init.length - 1] !== current){
            init.push(current);
        }
        return init;
    }, []);
}

// 3、利用对象键值唯一去重
// 300ms左右
function unique(arr) {
    const _arr = [];
    const tmp = {};
    for (let i = 0; i < arr.length; i++) {
        // 使用JSON.stringify()进行序列化
        if (!tmp[typeof arr[i] + JSON.stringify(arr[i])]) {
            // 将对象序列化之后作为key来使用
            tmp[typeof arr[i] + JSON.stringify(arr[i])] = 1;
            _arr.push(arr[i]);
        }
    }
    return _arr;
}

// 4、ES6 Map去重
// 30ms左右（很快）
function unique(arr) {
    const tmp = new Map();
    return arr.filter(item => {
        return !tmp.has(item) && tmp.set(item, 1);
    })
}

// 5、ES6 Set去重
// 40ms左右（很快）
function unique(arr) {
    return [...new Set(arr)];
}
```
