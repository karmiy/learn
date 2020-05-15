## JS操作CSS样式

### 外部样式

```html
单纯的JS不能操作外部文件<link rel="stylesheet" href="...">
```
    
### 内部样式（不推荐）

```js
// 1、新增style
var oStyle = document.createElement('style');
oStyle.innerHTML = '#wrap { width: 100px; height: 100px }';
document.head.appendChild(oStyle);
```
    
```html
// 2、添加样式
<head>
    ...
    <style id='oStyle'>
        ...
    </style>
</head>

<script>
    var oStyle = document.getElementById('oStyle'); 
    oStyle.innerHTML += '#wrap { width: 100px; height: 100px }';
</script>
```
    
### 行内样式（较常用）
    
```html
<div id='wrap'>...</div>
```
    
```js
var wrap = document.getElementById('wrap');

// 改变单个属性样式
wrap.style.width = '200px';
wrap.style.backgroundColor = 'pink'; // 不允许出现-，如background-color，要采用驼峰写法

// 改变整个style
wrap.style.cssText += 'height: 200px; color: red;';

// 获取属性值
console.log(wrap.style.width); // 输出'200px'

// 特殊样式
wrap.style.float = 'left'; // 这是错误的写法！！！

wrap.style.cssFloat = 'left'; // 这才是正确的写法
wrap.style.styleFloat = 'left'; // 2个都要写，为了兼容IE和部分浏览器
```
    
### className（较常用）
    
```css
#wrap {
    width: 200px;
    ...
}
.afterClick {
    width: 500px
}
```
    
```js
var wrap = document.getElementById('wrap');
wrap.onclick = function() {
    // 点击后添加.afterClick类名
    wrap.className += 'afterClick';
}
```
    
## JS数据类型分类

JavaScript数据类型分为基础数据类型与引用型

> &#9733; 贴士 

```js
面试经常会问：
JavaScript数据类型怎么分类？
JavaScript基础数据类型有哪些？

基础数据类型：
1、undefined
2、number
3、string
4、boolean
5、null
6、symbol（ES6新增）
7、BigInt（ES10新增）

引用数据类型：
1、object
```
    
### undefined未定义

```js
// 任何一个定义出来没有赋值的变量，默认数据都是undefined

// undefined分类如下
1、var a;
2、console.log(document.karmiy); // 对象根本不存在的属性

// 注
console.log(b); 这样不是undefined，如果一个变量定义都没定义，输出是报错的！！！
```
    
### number数字

```js
var x = 10;
var y = 10.5;
var z = .5; // 0可以省略

// 特殊的number
NaN（not a number），表示不是一个数字

// 小数运算问题
console.log(0.1 + 0.2); // 输出0.3000000000......4，这是计算机二进制运算导致的

// 正负无穷
Infinity
-Infinity
```
    
### string字符串

```js
var s = "karmiy"; // 双引号
var s = 'karmiy'; // 单引号
var s = "kar\"miy"; // 里面带引号需要\转义
var s = "kar\\miy"; // 里面带\要\\转义
var s = "kar\nmiy"; // 换行
```
    
更多特殊字符参考W3C：

[JavaScript 特殊字符](http://www.w3school.com.cn/js/js_special_characters.asp)

### boolean

```js
var b = true;
var b = false;
```
    
### null

```js
// 知道一个变量需要用来存储一个变量，但是还不知道会存储什么，就先赋值为null

var n = null;

var wrap = document.getElementById('wrap'); // 如果找不到，得到是null
```
    
### object对象

```text
// 对象可以拥有很多属性（其他基础数据类型除了JS规定的属性外，不能再添加独有的属性）

// 分类

1、数组[]：一种特殊的对象，数据的组合，可以用[数字下标]取值
2、json{}
3、内置对象：JS已经规定好的对象，如：document、window等
4、节点对象：如document.getElementById获取的DOM节点对象
5、函数：一个很特殊的对象，可以执行来运行内部代码块
...
```
    

    