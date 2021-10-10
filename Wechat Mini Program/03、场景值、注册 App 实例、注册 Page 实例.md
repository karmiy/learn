## 框架系统

整个小程序框架系统分为两部分：

- 逻辑层（App Service）
- 视图层（View）

与 Vue MVVM 类似，数据响应式变化驱动视图更新

## 场景值

### 定义

述用户进入小程序的路径，如：

- 单人聊天会话中的小程序消息卡片
- 扫描二维码
- 长按图片识别二维码

完整场景值的含义请查看 [场景值列表](https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html)

> 由于Android系统限制，目前还无法获取到按 Home 键退出到桌面，然后从桌面再次进小程序的场景值，对于这种情况，会保留上一次的场景值

### 获取

- app.ts 的 `onLaunch` 和 `onShow`
- [wx.getLaunchOptionsSync](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html)

## 注册 App 实例

每个小程序都会在 app.ts 里调用 `App` 方法注册小程序实例，整个小程序只有一个 App 实例

### gloablData 全局状态

App 实例中存在 `globalData` 全局状态，可以在全页面共享

```js
App({
    globalData: 'I am global data'
});
```

### App 注册事件

此外还有需要注册事件：

- onLaunch(Object object)：小程序**初始化完成时**触发，**全局只触发一次**，参数也可以使用 [wx.getLaunchOptionsSync](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html) 获取
- onShow(Object object)：小程序**启动**，或**从后台进入前台**时触发，也可以使用 [wx.onAppShow](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppShow.html) 绑定监听

> 触发顺序：onLaunch => onShow

- onHide()：小程序**从前台切到后台**时触发，也可以使用 [wx.onAppHide](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppHide.html) 绑定监听
- onError(String error)：发生脚本错误时触发（app.ts、[page].ts 都会触发），也可以使用 [wx.onError](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onError.html) 绑定监听
- onPageNotFound(Object object)：小程序要打开的页面不存在时触发。也可以使用 [wx.onPageNotFound](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html) 绑定监听

```ts
App({
    onPageNotFound(res) {
        wx.redirectTo({
            url: 'pages/...'
        }) // 如果是 tabbar 页面，请使用 wx.switchTab
    }
});
```

- onUnhandledRejection(Object object)：小程序有未处理的 Promise 拒绝时触发。也可以使用 [wx.onUnhandledRejection](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onUnhandledRejection.html) 绑定监听
- onThemeChange(Object object)：系统切换主题时触发。也可以使用 [wx.onThemeChange](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onThemeChange.html) 绑定监听

### getApp 获取 App 实例

除了 app.ts 内，小程序提供了 `getApp(Object object)` 方法使得开发者可以在其他页面获取 App 实例

参数：

- allowDefault：在 `App` 未定义时返回默认实现。当 App 被调用时，默认实现中定义的属性会被覆盖合并到 App 中。一般用于[独立分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html)（独立分包可能刚进去的页面是其他分包，这时还没加载注册主包的 App，分包拿到的 getApp 会是 undefined，而配置 allowDefault 则可以先返回一个默认实现，等 App 被注册了，再合并）

```ts
// log.ts
const appInstance = getApp();
console.log(appInstance.globalData);
```

注意：

- 不要在 App 函数中（使用 this 就行了），或调用 App 前就调用 getApp()
- getApp 拿到实例后，不要私自调用生命周期函数

## 注册 Page 实例

每个页面都可以在自己的 ts 文件中进行注册

小程序提供了全局的 Page 方法用于注册页面

### Page 初始 data、setData

同 Vue2.x，小程序也使用 `data` 作为页面的初始数据与状态

```javascript
Page({
    data: {
        text: 'init data',
        array: [{msg: '1'}, {msg: '2'}]
    },
    onLoad() {
        console.log(this.data.text); // Page 方法内使用 this.data 访问
    },
});
```

```html
<view>{{text}}</view>
<view>{{array[0].msg}}</view>
```

> 请不要将 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题

更新状态时，并不能直接 `this.data.xxx = xx` 更新

小程序提供了 `this.setData` 方法更新数据：

```ts
Page({
    data: {
        text: 'init data',
    },
    onClick() {
        // data：要改变的数据
        // callback：界面更新渲染完毕后的回调函数
        this.setData({ text: 'updated data' }, () => console.log('update success'));
    },
});
```

值得注意的是：

- setData 更新 this.data 的值是**同步**的（这意味着 setData 下一行可以立即 this.data 拿到最新值）
- 将数据从逻辑层发送到视图层是**异步**的

### 组件事件处理函数

与 Vue 的 v-bind 类似，小程序中使用 `bindtap` 绑定点击事件

```html
<view bindtap="viewTap"> click me </view>
```

```javascript
Page({
    viewTap: function() {
        console.log('view tap');
    }
});
```

除了 tap 点击事件，更多小程序组件事件可以查看 [事件绑定](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)

### 生命周期

- onLoad(Object query)：页面**加载时**触发。一个页面**只会调用一次**，可以在 onLoad 参数中获取打开当前页面路径中的参数
- onShow：页面显示/切入前台时触发
- onReady：页面**初次渲染完成时**触发，一个页面**只会调用一次**（代表页面已经准备妥当，可以和视图层进行交互）。对界面内容的设置，如 wx.setNavigationBarTitle，就需要在 onReady 后进行

> App onLaunch => App onShow => Page onLoad => Page onShow => Page onReady

- onHide：页面隐藏（[wx.navigateTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html) 跳转页面、tab 切去其他页面）/切入后台时触发
- onUpload：页面卸载时触发（[wx.redirectTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html) 重定向、[wx.navigateBack](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html) 关闭当前页后退）

### 页面事件处理函数

- onPullDownRefresh：监听用户下拉事件（需要先在 app.json 或页面 [page].json 开启 `enablePullDownRefresh`），该事件除了用户下拉触发，也可以通过 [wx.startPullDownRefresh](https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.startPullDownRefresh.html) 脚本手动触发，处理完事件行为后，再调用 [wx.stopPullDownRefresh](https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.stopPullDownRefresh.html) 停止下拉刷新动画
- onReachBottom：监听用户上拉触底事件（可以在 app.json 或页面 [page].json 设置 `onReachBottomDistance`）
- onPageScroll(Object object)：监听用户滑动页面事件
  - scrollTop：垂直方向已滚动的距离，单位 px

> 避免在 onPageScroll 频繁执行 setData 操作引起高频 逻辑 - 视图 通讯交互

- onAddToFavorites(Object object)：监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容
  - webViewUrl：页面中包含 [web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html) 组件时，返回当前 [web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html) 的url

```javascript
Page({
    onAddToFavorites(res) {
        // webview 页面返回 webViewUrl
        console.log('webViewUrl: ', res.webViewUrl);
        
        // 此事件处理函数需要 return 一个 Object，用于自定义收藏内容
        return {
            title: '自定义标题', // 自定义标题，默认页面标题或账号名称
            imageUrl: 'http://demo.png', // 自定义图片，显示图片长宽比为 1：1，默认页面截图
            query: 'name=xxx&age=xxx', // 自定义 query 字段，默认当前页面的 query
        };
    }
});
```

> 本接口为 Beta 版本，安卓 7.0.15 版本起支持，暂只在安卓平台支持

- onShareAppMessage(Object object)：监听点击页面内的转发按钮（[button](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) 组件 `open-type="share"`）或右上角菜单的 ”转发“ 按钮，并自定义转发内容
  - from：转发事件来源（`button`：页面内转发按钮、`menu`：右上角转发菜单）
  - target：如果 `from` 值是 `button`，则 `target` 是触发这次转发事件的 `button`，否则为 `undefined`
  - webViewUrl：页面中包含 [web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html) 组件时，返回当前 [web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html) 的url

```javascript
Page({
    onShareAppMessage() {
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    title: '自定义转发标题'
                })
            }, 2000);
        });
        
        // 此事件处理函数需要 return 一个 Object，用于自定义转发内容
        return {
            title: '自定义转发标题', // 转发标题，默认当前小程序名称
            path: '/page/user?id=123', // 转发路径，默认当前页面 path，必须是以 / 开头的完整路径
            imageUrl: 'http://demo.png', // 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4，默认使用截图
            promise, // 如果存在此函数，则以 resolve 结果过准，但 3s 内不 resolve 会使用上面传入的默认参数
        };
    }
});
```

> 只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮

- onShareTimeline：监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容

```ts
Page({
    onShareTimeline() {
        // 事件处理函数返回一个 Object，用于自定义分享内容，不支持自定义页面路径
        return {
            title: '自定义标题', // 自定义标题，即朋友圈列表页上显示的标题，默认当前小程序名称
            query: 'a=1&b=2', // 自定义页面路径中携带的参数，默认当前页面路径携带的参数
            imageUrl: 'http://demo.png', // 自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1，默认使用小程序 Logo
        };
    }
});
```

> 只有定义了此事件处理函数，右上角菜单才会显示“分享到朋友圈”按钮

- onResize(Object object)：页面尺寸改变时触发（小程序屏幕旋转时触发）。详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#在手机上启用屏幕旋转支持)
- onTapItemTap(Object object)：点击 tab 时触发
  - index：被点击tabItem的序号，从 0 开始
  - pagePath：被点击 tabItem 的页面路径、
  - text：被点击 tabItem 的按钮文字

> 只能触发点击当前页面 tab 的回调，如 index、logs 为 tab 列表，在 index 页面绑定了该事件，点击 logs 的选项卡切换到 logs 页面不会触发 index 页面的 onTapItemTap，只有点击 index 的 tab 才会触发

- onSaveExitState：每当小程序可能被销毁之前，页面回调函数 `onSaveExitState` 会被调用，可以进行 [退出状态](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html#_4-退出状态) 的保存

## EventChannel 页面通讯

如果一个页面由另一个页面通过 [`wx.navigateTo`](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html) 打开，这两个页面间将建立一条数据通道

- 被打开的页面可以通过 `this.getOpenerEventChannel()` 方法来获得一个 `EventChannel` 对象
- `wx.navigateTo` 的 `success` 回调中也包含一个 `EventChannel` 对象

```ts
// index.ts
Page({
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
            success(e) {
                // on 监听
                e.eventChannel.on('receiver', (params) => {
                    console.log('接收到的参数：', params);
                });
            }
        })
    },
});

// logs.ts
Page({
    onLoad() {
        const eventChannel = this.getOpenerEventChannel();
        // emit 派发
        eventChannel.emit('receiver', { id: 100 });
    },
});
```
