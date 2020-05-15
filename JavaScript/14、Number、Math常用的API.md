## Number常用的API

### isNaN

```js
// 说明
not a number的缩写，判断是否不是一个数
ES5是在window对象上，ES6部署到了Number对象上，但是作用不同

// window下的isNaN：如果参数能被Number()转为数字，返回false

isNaN(1); // false
isNaN('1'); // false（'1'会被Number()转为1）
isNaN(true); // false（true会被Number()转为1）
isNaN('1a'); // true
isNaN('true'); // true
isNaN({}); // true
isNaN(NaN); // true（特殊，NaN在isNaN下是true）

// 存在的疑问
NaN在我们之前提过，typeof NaN是number，但是isNaN在参数为NaN时却是true，说它不是一个数；
假如我们想要判断一个变量是否是NaN怎么办？

可能会想这样做：
if(x === NaN){ ... }

很遗憾，console.log(NaN === NaN); 是会输出false的，非常特殊

那换成isNaN去判断：
isNaN(NaN); // 输出true
isNaN('aaa'); // 输出true

并没有办法判断这个变量是不是NaN

于是ES6便在Number上绑定了一个isNaN方法来解决这个问题

// Number下的isNaN：纯属判断一个变量是不是NaN,只有NaN才会返回true,其他返回false
Number.isNaN(NaN); // true
Number.isNaN(1); // false
Number.isNaN('1'); // false
Number.isNaN('1ab'); // false
Number.isNaN({}); // false
Number.isNaN(true); // false

// 如果没有ES6的Number.isNaN，有什么polyfill是可以兼容的？

Number.isNaN || (Number.isNaN = function(n) {
    return n !== n; // 利用NaN === NaN 是false的特性
})
```
    
### parseInt

```js
// 说明
强制取整，可以做到Number()做不到的转换
从第一位非空格的字符开始识别，能取到满足规则的数字则返回数字，否则NaN
ES5在window对象中，ES6部署到了Number对象上

// 示例
console.log(Number('10.2')); // 10.2
console.log(Number('10px')); // NaN，转不了

console.log(parseInt('10px')); // 10，可以转，从第一个非空格字符开始识别（即1），识别到10，下一个是p，不满足数字了，所以返回10
console.log(parseInt('10px20')); // 10
console.log(parseInt('10.2px20')); // 10
console.log(parseInt('abc20')); // NaN，第一个非空字符是a，直接不满足
console.log(parseInt('   -10abc')); // -10
console.log(parseInt('   +10abc')); // 10
console.log(parseInt('   - 10abc')); // NaN
console.log(parseInt('.1')); // NaN
console.log(parseInt('0.1')); // 0
```
    
### parseFloat

```js
// 说明
强制取数，和parseInt规则一样，可以去到小数
console.log(parseFloat('10.2px20')); // 10.2
console.log(parseFloat('10px20')); // 10
console.log(parseFloat('.1')); // 0.1

// 应用场景
我们经常会取形如绝对定位的top来进行计算
var top = wrap.style.top;

但是取到的top是如 10.5px 这样的字符串，我们只想要10.5

可能很多人会正则去除单位或更奇怪的做法

其实只要parseFloat(top)就可以去除多余的单位部分了
```
    
### toFixed

```js
// 保留指定小数位，参数值0~100，返回string类型

console.log(new Number(12.1).toFixed(2)); // '12.10'
console.log(new Number(12.1).toFixed(3)); // '12.100'
console.log(new Number(12.1).toFixed(0)); // '12'

一般更多不会这样写，会：
Number.prototype.toFixed.call(12.1, 2); // '12.10'
或封装一个函数
function fn(num, n) {
    return num.toFixed(n);
}

// 注
toFixed大家都认为是四舍五入，其实不是
toFixed主要以四舍六入五成双
4舍去，6进一
5分两种情况：
    5后有数时，进1
    5后没有数时，再分两种：
        5前是奇数，进1
        5前是偶数，舍去
但是为什么说‘主要’，因为5后面没有数的情况时，也不一定准确，如下示例
// 示例
console.log(fn(12.35, 1)); // '12.3'（5前是奇数，却没进1）

// 为了满足小数的四舍五入，可以自定义函数
function toFixed(number, fractionDigits){  
    return Math.round(number * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);  
}  
```
    
## Math常用的API
    
### 圆周率π

```js
console.log(Math.PI); // 3.141592653589793
```
    
### Math.max、Math.min
    
```js
// 说明
Math.max 取最大值
Math.min 取最小值

Math.max(5, 6, 78, 99); // 99
Math.max(5, 6, 78, '99'); // 99（也可以是字符串，能被Number()转就行）

Math.min(5, 6, 78, 99); // 5

// 应用场景

1、取数组中的最大/小值
var arr = [5, 6, 9, 8];
console.log(Math.max.apply(null, arr)); // 9

2、项目开发中，限制取值范围

如我们计算得到top，要判断top不能超过100，不小于1，可能会这样做
var top = calcTop();
if(top < 1) {
    top = 1;
}else if(top > 100) {
    top = 100;
}

其实不需要这样，if判断使代码看起来很low，只需：
top = Math.max(top, 1);
top = Math.min(top, 100);
```
    
### Math.floor、Math.ceil、Math.round
    
```js
// 说明
Math.floor 向下取整
Math.ceil 向上取证
Math.round 四舍五入

Math.floor(10.99); // 10
Math.floor('10.99'); // 10（也会通过Number()转）
Math.ceil(10.99); // 11
Math.round(10.44); // 10
```
    
### Math.random
    
```js
// 说明
获取[0, 1)之间的随机数，注意左区间包含，右区间不包含

var a = Math.random(); // 获取[0, 1)随机数
var a = Math.random() * 10; // 获取[0, 10)随机数
var a = Math.random() * 5 + 10; // 获取[10, 15)随机数
var a = Math.floor(Math.random() * 6 + 10); // 获取[10, 15]随机整数
```
    
### Math.abs

```js
// 说明
取绝对值

console.log(Math.abs(-10.2)); // 10.2
```
     
### Math.sqrt、Math.pow
 
 ```js
// 说明
Math.sqrt 平方根
Math.pow 次幂

Math.sqrt(4); // 2
Math.pow(2, 3); // 8
```
    
### 其他API

参考W3C

[W3C Math](http://www.w3school.com.cn/jsref/jsref_obj_math.asp)
