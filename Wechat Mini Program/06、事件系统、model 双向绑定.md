## 事件

### 基本使用

```html
<view id="tapTest" data-hi="Weixin" bindtap="tapName"> Click me! </view>
<!-- bind: 写法，基础库版本 2.8.1 起，在所有组件中开始提供这个支持 -->
<view id="tapTest" data-hi="Weixin" bind:tap="tapName"> Click me! </view>

<!-- 还可以是一个数据绑定 -->
<view bindtap="{{ handlerName }}">
    Click here!
</view>
```

```js
Page({
    data: {
        handlerName: 'tapName',
    },
    tapName: function(event) {
        console.log(event)
    }
});
```

打印结构：

```json
{
    "type":"tap",
    "timeStamp":895,
    "target": {
        "id": "tapTest",
        "dataset":  {
            "hi":"Weixin"
        }
    },
    "currentTarget":  {
        "id": "tapTest",
        "dataset": {
            "hi":"Weixin"
        }
    },
    "detail": {
        "x":53,
        "y":14
    },
    "touches":[{
        "identifier":0,
        "pageX":53,
        "pageY":14,
        "clientX":53,
        "clientY":14
    }],
    "changedTouches":[{
        "identifier":0,
        "pageX":53,
        "pageY":14,
        "clientX":53,
        "clientY":14
    }]
}
```

### 事件分类

事件分为冒泡事件和非冒泡事件，同 H5 冒泡行为

WXML 冒泡事件：

- touchstart
- touchmove
- touchcancel
- touchend
- tap：手指触摸后马上离开，类似于点击
- longpress：手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发
- longtap（推使用 longpress 代替）：手指触摸后，超过350ms再离开
- transitionend：在 WXSS transition 或 wx.createAnimation 动画结束后触发

> 每有一个属性过渡完成，就会触发一次，如 animation.translateY(-90).opacity(0.1).step() 是 2 个属性，会触发 2 次

- animationstart：在一个 WXSS animation 动画开始时触发
- animationiteration：在一个 WXSS animation 一次迭代结束时触发
- animationend：在一个 WXSS animation 动画完成时触发

> animation 监听的是 css3 使用 `@keyframes` 定义的动画的执行结束事件和动画循环事件

- touchforcechange：在支持 3D Touch 的 iPhone 设备，重按时会触发

除此之外，**其他组件自定义事件如无特殊声明都是非冒泡事件**

- [form](https://developers.weixin.qq.com/miniprogram/dev/component/form.html) 的 `submit `事件
- [input](https://developers.weixin.qq.com/miniprogram/dev/component/input.html) 的 `input` 事件
- [scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html) 的 `scroll` 事件

### 阻止冒泡

除了 `bind`，也可以用 `catch` 来绑定事件

与 `bind` 不同， `catch` 会阻止事件向上冒泡

```html
<view id="outer" bindtap="handleTap1">
    outer view
    <view id="middle" catchtap="handleTap2">
        middle view
        <view id="inner" bindtap="handleTap3">
            inner view
        </view>
    </view>
</view>
```

- 点击 inner view：触发 handleTap3、handleTap2，因为 2 阻止了冒泡
- 点击 middle view：触发 handleTap2，因为 2 阻止了冒泡
- 点击 outer view：触发 handleTap1

### 互斥事件

除了 `bind` 和 `catch` 外，还可以使用 `mut-bind` 来绑定事件

所有 `mut-bind` 是“互斥”的，只会有其中一个绑定函数被触发。同时，它完全不影响 `bind` 和 `catch` 的绑定效果

```html
<view id="outer" mut-bind:tap="handleTap1">
    outer view
    <view id="middle" bindtap="handleTap2">
        middle view
        <view id="inner" mut-bind:tap="handleTap3">
            inner view
        </view>
    </view>
</view>
```

- 点击 inner view：触发 handleTap3、handleTap2，因为与 1 的 mut-bind 互斥
- 点击 middle view：触发 handleTap2、handleTap1

### 事件捕获

需要在捕获阶段监听事件时，可以采用：

- capture-bind：捕获事件
- capture-catch：将中断捕获阶段和取消冒泡阶段

```html
<view id="outer" bind:touchstart="handleTap1" capture-bind:touchstart="handleTap2">
    outer view
    <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
        inner view
    </view>
</view>
```

- 点击 inner view：触发 handleTap2、handleTap4、handleTap3、handleTap1

```html
<view id="outer" bind:touchstart="handleTap1" capture-catch:touchstart="handleTap2">
    outer view
    <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
        inner view
    </view>
</view>
```

点击 inner view：触发 handleTap2

### 事件对象

具体见 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)

值得注意的是

`dataset` 可以挂载对象

```html
<view data-obj="{{dataObj}}" bindtap="test">123</view>
```

```ts
Page({
    data: {
        dataObj: {
            obj: 1
        }
    },
    test(e) {
        // { obj: 1 }
        console.log(e.currentTarget.dataset.obj);
    }
});
```

除了 dataset 自定义数据外，可以使用 `mark` 来识别具体触发事件的 target 节点

事件触发时，冒泡路径上所有的 `mark` 会被合并（即时不是冒泡事件，也会合并）

```html
<view mark:myMark="last" bindtap="bindViewTap">
  	<button mark:anotherMark="leaf" bindtap="bindButtonTap">按钮</button>
</view>
```

```js
Page({
    bindViewTap: function(e) {
        e.mark.myMark === "last" // true
        e.mark.anotherMark === "leaf" // true
    }
});
```

`mark` 与 `dataset` 区别在于：

- `mark` 会包含从触发事件的节点到根节点上所有的 `mark` 属性
- `dataset` 仅包含一个节点的 data-

注意：

- 同名的 `mark` ，父节点的 `mark` 会被子节点覆盖，优先级：子 > 父
- 自定义组件中接收事件时， `mark` 不包含自定义组件外的节点的 `mark`
- `mark` 不会做连字符和大小写转换

### WXS 响应事件

有时做一些交互动画，会遇到性能瓶颈，如 movable 元素拖动

卡顿的**原因**也主要在于：

- touchmove 事件从渲染层 Webview 到逻辑层 App Service
- 逻辑层处理事件行为，再 setData 更新

这些操作经过了 2 次逻辑层与渲染层的交互，1 次 render，然而：

- 通信的耗时是比较大的
- setData 渲染会阻塞其他脚本执行

**解决方案：**

`WXS` 允许在渲染层 Webview，可以利用这个点减少通信次数

**实现：**

`WXS` 能做的逻辑较少，小程序提供了一些机制实现了与开发者 App Service 的通信

具体细节可见 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/interactive-animation.html) 与 [官网具体示例](https://developers.weixin.qq.com/s/L1G0Dkmc7G8a)

下面列举一个 movable 示例代码：

```ts
// movable.wxs
var startX = 0
var startY = 0
var lastLeft = lastTop = 50
function touchstart(event, ins) {
    var touch = event.touches[0] || event.changedTouches[0]
    startX = touch.pageX
    startY = touch.pageY
    
    // 与 App Service 层的 movable.ts 处的方法通讯
    ins.callMethod('testCallmethod', {
        complete: function(res) {
            console.log('args', res)
        }
    })
}
function touchmove(event, ins) {
    var touch = event.touches[0] || event.changedTouches[0]
    var pageX = touch.pageX
    var pageY = touch.pageY
    var left = pageX - startX + lastLeft
    var top = pageY - startY + lastTop
    startX = pageX
    startY = pageY
    lastLeft = left
    lastTop = top
    // console.log('idff', pageX - context.startX, left, top)
    ins.selectComponent('.movable').setStyle({
        left: left + 'px',
        top: top + 'px'
    })
    // console.log('get data', JSON.stringify(ins.selectComponent('.movable')[0].getData()))
    // console.log('get data set', JSON.stringify(ins.selectComponent('.movable')[0].getDataset()))
    // console.log('test select', ins.selectComponent('.movable')[0].selectComponent('.dd'))
}
module.exports = {
    touchstart: touchstart,
    touchmove: touchmove,
}
```

```html
<!-- movable.wxml -->
<wxs module="test" src="./movable.wxs"></wxs> 
<view wx:if="{{show}}" class="area" style='position:relative;width:100%;height:100%;'>
  <view data-index="1" data-obj="{{dataObj}}" bindtouchstart="{{test.touchstart}}" bindtouchmove="{{test.touchmove}}" bindtouchend='{{test.touchmove}}' class="movable" style="position:absolute;width:100px;height:100px;background:red;left:{{left}}px;top:{{top}}px"></view>
</view>
```

```ts
// movable.ts
Page({
    data: {
        left: 50,
        top: 50,
        show: true,
        dataObj: {
            obj: 1
        }
    },
    testCallmethod() {
        console.log('testCallmethod');
    },
})
```

## model 双向绑定

类型于 Vue 的 v-model

### 基本使用

小程序使用 `model:` 进行双向绑定

```html
<input model:value="{{value}}" />

<!-- 只能是单一值，以下非法 -->
<input model:value="{{ a + b }}" />

<!-- 不支持路径写法，以下非法 -->
<input model:value="{{ a.b }}" />
```

### 自定义组件双向绑定

> 不同于 Vue2.x，小程序可以有多个双向绑定

```html
<!-- components/status-alert/status-alert.wxml -->
<input model:value="{{value1}}" />
<text>[value1 - inner]: {{value1}}</text>
<input model:value="{{value2}}" />
<text>[value2 - inner]: {{value2}}</text>
```

```ts
// components/status-alert/status-alert.ts
Component({
    properties: {
        value1: String,
        value2: String,
    },
    data: {},
    methods: {}
});

```

```html
<!-- pages/index/index.wxml -->
<status-alert model:value1="{{value1}}" model:value2="{{value2}}" />
<text>[value1 - outer]: {{value1}}</text>
<text>[value2 - outer]: {{value2}}</text>
```

```ts
// pages/index/index.ts
Page({
    data: {
        input1: 'basic1',
    	input2: 'basic2',
    },
});
```

也可以在自定义组件中手动触发双向绑定更新：

```js
Component({
    methods: {
        update: function() {
            this.setData({
                input1: 'leaf'
            })
        }
    }
});
```