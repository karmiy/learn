## 获取页面节点

[节点信息查询 API](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html) 可以用于获取节点属性、样式、在界面上的位置等信息

```js
const query = wx.createSelectorQuery()
query.select('#the-id').boundingClientRect(function(res){
    res.top // #the-id 节点的上边界坐标（相对于显示区域）
});
query.selectViewport().scrollOffset(function(res){
    res.scrollTop // 显示区域的竖直滚动位置
});
query.exec();
```

> 推荐使用 `this.createSelectorQuery` 来代替 [wx.createSelectorQuery](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html) ，这样可以确保在正确的范围内选择节点

> 注：viewport 窗口，是不包括顶部 Nav 与底部 TabBar 的

## IntersectionObserver

[节点布局相交状态 API](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createIntersectionObserver.html) 可用于监听两个或多个组件节点在布局位置上的相交状态

通常用于推断：

- 节点是否可以被用户看见
- 有多大比例可以被用户看见

> 可用于做埋点统计

如节点在窗口暴露 20%、50% 时触发：

```ts
Page({
    onLoad: function(){
        // 相比 wx.createIntersectionObserver(this, { thresholds: [0.2, 0.5] })
        // 更推荐 this.createIntersectionObserver
		this.createIntersectionObserver({
            // 暴露 20%，暴露 50%，50% => 50% 内，20% => 20% 内，都会触发
          	thresholds: [0.2, 0.5]
        }).relativeToViewport().observe('.intersection', (res) => {
            console.log(
                res.intersectionRatio, // 相交区域占目标节点的布局区域的比例
                res.intersectionRect, // 相交区域
                res.intersectionRect.left, // 相交区域的左边界坐标
                res.intersectionRect.top, // 相交区域的上边界坐标
                res.intersectionRect.width, // 相交区域的宽度
                res.intersectionRect.height, // 相交区域的高度
            );
        });
    }
});
```

> 注：与页面显示区域的相交区域并不准确代表用户可见的区域，viewport 是不包括 Nav、TabBar 的，且布局区域可能在绘制时被其他节点裁剪隐藏（祖先节点 overflow hidden）或折叠（fixed 元素）

## Media 响应式布局

### 启用屏幕旋转支持

默认情况下，小页面初始化后尺寸就不会变化了

小程序允许在开启屏幕旋转：

- `app.json` 的 `window` 段中设置 `"pageOrientation": "auto"` 
- 或在页面 json 文件中配置 `"pageOrientation": "auto"`

### iPad 启动屏幕旋转

从小程序基础库版本 [2.3.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始，小程序支持 iPad 屏幕旋转

- 在 `app.json` 中添加 `"resizable": true`

> iPad 的配置只能是 app.json 全局配置，无法在独立页面 [page].json 配置

### Media Query 样式

类似 CSS 媒体查询，小程序也可以使用这类样式：

```css
.my-class {
    width: 40px;
}

@media (min-width: 480px) {
    /* 仅在 480px 或更宽的屏幕上生效的样式规则 */
    .my-class {
        width: 200px;
    }
}
```

### Media Query 组件

可以使用 [match-media](https://developers.weixin.qq.com/miniprogram/dev/component/match-media.html) 组件来根据 media query 匹配状态展示、隐藏节点

```html
<match-media min-width="300" max-width="600">
    <view>当页面宽度在 300 ~ 500 px 之间时展示这里</view>
</match-media>

<match-media min-height="400" orientation="landscape">
    <view>当页面高度不小于 400 px 且屏幕方向为纵向时展示这里</view>
</match-media>
```

### JS 监听 Media Query

可以在页面或者自定义组件 JS 中使用 `this.createMediaQueryObserver()` 方法来创建一个 [`MediaQueryObserver`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/MediaQueryObserver.html) 对象

监听指定的 media query 的匹配状态

```ts
Page({
    onLoad() {
        this.createMediaQueryObserver().observe({ minWidth: 100, maxWidth: 800 }, res => {
            console.log(res.matches); // true
        });
    },
});
```

### 页面尺寸

可以手动获取显示区域的尺寸（不是整个手机屏幕，不包含 Nav、TabBar）：

```ts
Page({
    onLoad() {
        this.createSelectorQuery().selectViewport().boundingClientRect(rect => {
            console.log(rect);
        }).exec();
    },
});
```

### 旋转事件

- 页面尺寸变化：使用 `onResize` 监听

```ts
Page({
    onResize(res) {
        res.size.windowWidth // 新的显示区域宽度
        res.size.windowHeight // 新的显示区域高度
    }
});
```

- 自定义组件：resize 生命周期

```ts
Component({
    pageLifetimes: {
        resize(res) {
            res.size.windowWidth // 新的显示区域宽度
            res.size.windowHeight // 新的显示区域高度
        }
    }
});
```

- 还可以使用 [wx.onWindowResize](https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.onWindowResize.html) 来监听（但这不是推荐的方式）

## 分栏模式

在 PC 等能够以较大屏幕显示小程序的环境下，小程序支持以分栏模式展示。分栏模式可以将微信窗口分为左右两半，各展示一个页面

具体见 [官方文档]（https://developers.weixin.qq.com/miniprogram/dev/framework/view/frameset.html）

