## WXML 语法

### 数据绑定

同 Vue 一样 {{}} 将 data 与 template 进行绑定：

```html
<view> {{ message }} </view>
```

```ts
Page({
    data: {
        message: 'Hello MINA!'
    }
});
```

> 与 Vue 不同的是，小程序数据绑定几乎都以 {{}}，不论是属性，还是值

属性进行数据绑定：

```html
<view id="item-{{id}}"> </view>
```

wx:if/else 条件控制：

```html
<view wx:if="{{length > 5}}"> </view>
<view wx:if="{{view == 'WEBVIEW'}}"> WEBVIEW </view>
<view wx:elif="{{view == 'APP'}}"> APP </view>
<view wx:else="{{view == 'MINA'}}"> MINA </view>
```

关键字：

```html
<checkbox checked="{{false}}"> </checkbox>
```

三元运算：

```html
<view hidden="{{flag ? true : false}}"> Hidden </view>
```

运算：

```html
<view> {{a + b}} + {{c}} + d </view>
<view>{{"hello" + name}}</view>
<view>{{object.key}} {{array[0]}}</view>
```

### 列表渲染

```html
<view wx:for="{{[zero, 1, 2, 3, 4]}}">{{index}} {{item}} </view>
```

```ts
Page({
    data: {
        zero: 0
    }
});
```

使用 `wx:for-item` 可以指定数组当前元素的变量名

使用 `wx:for-index` 可以指定数组当前下标的变量名

```html
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
    {{idx}}: {{itemName.message}}
</view>
```

在 block 上使用 wx:for，类似于 Vue 的 template，不会渲染标签：

```html
<block wx:for="{{[1, 2, 3]}}">
    <view> {{index}}: </view>
    <view> {{item}} </view>
</block>
```

使用 `wx:key` 指定列表唯一标识符

- 自指定，如 index、item、item.x
- wx:key="unique"
- wx:key="*this"，代表在 for 循环中的 item 本身

### 条件渲染

`wx:if`、`hidden` 判断是否渲染，类似于 Vue 的 v-if、v-show

```html
<view wx:if="{{length > 5}}"> 1 </view>
<view wx:elif="{{length > 2}}"> 2 </view>
<view wx:else> 3 </view>

<view hidden="{{length > 5}}"> 1 </view>
```

### Template 模板

WXML提供模板（template），可以在当前模板作用域中（跨文件需要使用下一小节引用方式）定义可复用的代码片段

```html
<template name="msgItem">
    <view>
        <text> {{index}}: {{msg}} </text>
        <text> Time: {{time}} </text>
    </view>
</template>

<template is="msgItem" data="{{...item}}"/>
```

```js
Page({
    data: {
        item: {
            index: 0,
            msg: 'this is a template',
            time: '2016-09-15'
        }
    }
});
```

### 引用

`import`可以在该文件中使用目标文件定义的`template`

```html
<!-- item.wxml -->
<template name="item">
    <text>{{text}}</text>
</template>
```

```html
<!-- index.wxml -->
<import src="item.wxml"/>
<template is="item" data="{{text: 'forbar'}}"/>
```

> import 有作用域概念，如 C import B，B import A，那 C 不能使用 A 的 template

除了 import，小程序还可以使用 `include` 将目标文件**除了** `<template/>` `<wxs/>` 外的整个代码引入，相当于是拷贝到 `include` 位置

```html
<!-- index.wxml -->
<include src="header.wxml"/>
<view> body </view>
<include src="footer.wxml"/>
```

## WXSS 语法

WeiXin Style Sheets，决定 WXML 的组件应该怎么显示

WXSS 具有 CSS 大部分特性，同时对 CSS 进行了扩充以及修改：

- 尺寸单位
- 样式导入

### 全局样式、局部样式

- 全局样式：定义在 app.wxss 的
- 局部样式：定义在 [page].wxss 的

### 尺寸单位

WXSS 新单位 `rpx`，类似 rem

满屏 750rpx，如 iPhone6 屏宽 375px，750 个物理像素

750rpx = 375px = 750 物理像素 => 1rpx = 0.5px = 1物理像素

### 样式引入

```less
/** common.wxss **/
.small-p {
  padding:5px;
}

/** app.wxss **/
@import "common.wxss";
.middle-p {
  padding:15px;
}
```

### 内联样式

```html
<!-- 一般动态样式才用到 -->
<view style="color:{{color}};" />

<view class="view {{isFocus ? 'is-focus' : ''}}" />
```

### 选择器

目前支持的选择器：

- .class：.container
- #id：#container
- element：view
- element, element：view, checkbox
- ::(before)after：view::(before)after

## WXS 语法

WXS（WeiXin Script）是小程序的一套脚本语言，结合 `WXML`，可以构建出页面的结构

- WXS 不依赖基础库版本，可在所有版本小程序运行
- WXS 有自己的语法，并不和 JavaScript 一致
- WXS 的运行环境和其他 JavaScript 代码是隔离的，WXS 中不能调用其他 JavaScript 文件中定义的函数，也不能调用小程序提供的API
- WXS 函数不能作为组件的事件回调
- 由于运行环境的差异，在 iOS 设备上小程序内的 WXS 会比 JavaScript 代码快 2 ~ 20 倍。在 android 设备上二者运行效率无差异

### 看法

在 WXML 里复用逻辑变量，功能函数等，个人感觉局限性比较多：

- 定义需要使用 var，无法使用 const 等关键字
- 无法使用 JavaScript 一些特性，如对象缩写 { foo } 只能是 { foo: foo }
- 无法使用 typescript
- 导出需要 module.exports，无法使用 ESM 的 export
- 在 WXML 使用导出的变量时，无法获得类型提示（是否有插件？）

优势：

- 在动画实现上性能瓶颈，以减少 Webview 与 App Service 通讯方案上有作为（见事件系统的 WXS 响应事件）

### 基本使用

```js
// /pages/tools.wxs

var foo = "hello world";
var bar = function (d) {
    return d;
}
module.exports = {
    foo: foo,
    bar: bar,
};
module.exports.msg = "some msg";
```

在 WXML 使用：

```html
<!-- page/index/index.wxml -->

<wxs src="./../tools.wxs" module="tools" />
<view> {{tools.msg}} </view>
<view> {{tools.bar(tools.foo)}} </view>
<!-- 结合页面 data 里的数据 -->
<view> {{tools.bar(msg)}} </view>
```

```js
Page({
    data: {
        msg: "'hello wrold' from js",
    }
});
```

在其他 wxs 模块使用：

```js
// /pages/logic.wxs

var tools = require("./tools.wxs");

console.log(tools.foo);
console.log(tools.bar("logic.wxs"));
console.log(tools.msg);
```

更多语法细节与用法，详见 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/02variate.html)

