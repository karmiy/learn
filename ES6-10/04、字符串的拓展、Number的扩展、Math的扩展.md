## 字符串的拓展

### 模板字符串

ES6引入了模板字符串\`${}\`的概念（`反引号是键盘Tab上面的按键）

```js
// 示例一
const [id, name] = [10, 'karmiy'];
const s  = `id是${id}，name是${name}`;
console.log(s); // 'id是10，name是karmiy'

// 示例二（允许换行）
const a = 10;
const html = `<ul>
                <li>${a + 1}</li>
                <li>${a + 2}</li>
                </ul>`;
    
    注：空格、tab、回车都会在

// 示例三（支持JavaScript表达式）
console.log(`${Math.max(10, 20)}`); // 20

// 示例四
alert`123`;
```

### String.prototype.includes / startsWith / endsWith

ES6新增String的API，用于包含关系检测

```js
// 示例一
const str = 'karmiy';
console.log(str.includes('kar')); // true

// 示例二
const str = 'karmiy';
console.log(str.includes('kar', 1)); // false，从下标1开始找

// 示例三
const str = 'karmiy';
console.log(str.startsWith('kar')); // true，以'kar'开头

// 示例四
const str = 'karmiy';
console.log(str.startsWith('arm', 1)); // true，从下标1开始，以'ary'开头

// 示例五
const str = 'karmiy';
console.log(str.endsWith('arm', 2)); // true，从后往前的下标2开始算起，以'ary'结尾
```
    
### String.prototype.repeat

ES6新增String的API，重复内容

```js
// 示例
console.log('ab*'.repeat(5)); // 'ab*ab*ab*ab*ab*'，重复5次
```
    
### String.prototype.padStart / padEnd

ES8新增String的API，补全内容
 
 ```js
// 示例一
console.log('ab'.padEnd(5, 'x')); // 'abxxx'，向后补全到5位，用'x'补

// 示例二
console.log('ab'.padStart(5, 'x')); // 'xxxab'，向前补全到5位，用'x'补

// 示例三
console.log('ab'.padStart(6, 'xyz')); // 'xyzxab'，向前补全到6位，用'xyz'补

// 示例四
console.log('abcde'.padStart(5, 'x')); // 'abcde'，本来就>=5，保持不变

// 示例五
console.log('0.0'.padStart(10))// '       0.0'，没有第二个参数则默认' '空格  

// 应用场景（补全日期如：'8' => '08'）
console.log('8'.padStart(2, '0')); // '08'
```
    
### String.prototype.trimStart / trimEnd

ES10新增String的API，去除开头（结尾）的空格

```js
// 示例一
console.log('   abc'.trimStart()); // 'abc'

// 示例二
console.log('abc  '.trimStart()); // 'abc'
```
    
## Number的扩展

### Number.isFinite

ES6新增Number的API，是否是有限数值，ES6严格区分正0与负-0

```js
// 示例
Number.isFinite(2); // true
Number.isFinite(NaN); // false
Number.isFinite('5'); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite(true); // false
Number.isFinite(Math.random()); // true

    注：isFinite只要是非数值类型的，都是false，不会隐式转换
```
        
### Number.isNaN

ES6新增Number的API，是否是NaN

ES5，因为NaN === NaN是false，window.isNaN也不是只有NaN才是true，导致我们无法很好的判断一个变量是否是NaN，而ES6提供了这个API来解决这个问题
    
```js
// 示例
Number.isNaN(NaN); // true
Number.isNaN(10); // false
Number.isNaN('10'); // false
Number.isNaN(true); // false
Number.isNaN(5/NaN); // true
Number.isNaN('true' / 0); // true
Number.isNaN('true' / 'true'); // true

    注：这个API，只有NaN才是true，其他都是false
```
        
### Number.parseInt / parseFloat

这两个方法与全局方法parseInt()和parseFloat()一致，目的是**逐步减少全局性的方法，让语言更模块化**
    
```js
Number.parseInt === parseInt; // true
Number.parseFloat === parseFloat; // true
```
    
### Number.isInteger

ES6新增Number的API，是否是整数
    
```js
// 示例
Number.isInteger(5); // true
Number.isInteger(5.0); // true
Number.isInteger(5.1); // false
Number.isInteger('true'); // false
```
    
## Math的扩展

### Math.trunc
    
ES6新增Number的API，强制取整
    
```js
// 示例
Math.trunc(2.99); // 2
Math.trunc(-2.99); // -2
Math.trunc('11.22'); // 11
Math.trunc(true); // 1
Math.trunc(false); // 0
Math.trunc(null); // 0
Math.trunc(NaN); // NaN
Math.trunc('leo'); // NaN
Math.trunc(); // NaN
Math.trunc(undefined); // NaN

    注：非数字会做隐式转换，不能转为NaN
    个人觉得还是位运算 |0取整比较好用
    
// ES5 polyfill
Math.trunc = Math.trunc || function(x){
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
```
    
### Math.sign

ES6新增Number的API，判断正负数还是正负0，返回1、-1判断正负数，0、-0判断正负0

```js
// 示例
Math.sign(-5.1); // -1
Math.sign(5); // 1
Math.sign(0); // 0
Math.sign(-0); // -0
Math.sign(NaN); // NaN
Math.sign(''); // 0
Math.sign(true); // 1
Math.sign(false);// 0
Math.sign(null); // 0
Math.sign('9'); // 1
Math.sign('leo'); // NaN
Math.sign(); // NaN
Math.sign(undefined); // NaN

    注：非数字会做隐式转换，不能转为NaN
    
// 顺带提一下，判断正负0的其他方式
判断+0： 1/Infinity === 0; // true;
判断-0： 1/-Infinity === -0; // true;
    
// ES5 polyfill
Math.sign = Math.sign || function (x){
    x = +x;
    if (x === 0 || isNaN(x)){
        return x;
    }
    return x > 0 ? 1: -1;
}
```

### Math.cbrt

ES6新增Number的API，求立方根

```js
// 示例
Math.cbrt(8); // 2
Math.cbrt(-1); // -1
Math.cbrt(0);  // 0
Math.cbrt(1);  // 1
Math.cbrt(2);  // 1.2599210498
Math.cbrt('1');   // 1
Math.cbrt('leo'); // NaN    

    注：非数字会做隐式转换，不能转为NaN

// ES5 polyfill 
Math.cbrt = Math.cbrt || function (x){
    var a = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
}
```
    
### Math.hypot

ES6新增Number的API，求平分和的平方根，即勾股定理
    
```js
// 示例
Math.hypot(3, 4); // 5
Math.hypot(6, 8 ,11); // 14.866068747318504
```
    
### 指数运算符**

ES7新增指数运算符**，与Math.pow等效计算结果

```js
// 示例
console.log(2**10);// 1024
```