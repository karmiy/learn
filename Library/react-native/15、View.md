## View

最基本的 UI 组件，支持 Flexbox 布局、样式、触摸响应、和一些无障碍功能的容器。不论在什么平台上，View 都直接对应当前平台的原生视图，无论它是 UIView、div 还是 android.view.View

### 合成点击事件

View 响应属性，如 onResponderMove

- nativeEvent

    - changedTouches: 从上一次事件以来的触摸事件数组

    - identifier: 触摸事件的 ID

    - locationX: 触摸事件相对元素本身位置的 X 坐标

    - locationY: 触摸事件相对元素本身位置的 Y 坐标

    - pageX: 触摸事件相对根元素位置的 X 坐标

    - pageY: 触摸事件相对根元素位置的 Y 坐标

    - target: 接收触摸事件的元素 ID

    - timestamp: 触摸事件的时间标记，用来计算速度

    - touches: 屏幕上所有当前触摸事件的数组.

- Props

- hitSlop: 定义按钮外延范围，即点按钮周围多远也算点到按钮，结构为 { top: number, left: number, bottom: number, right: number }

> 触摸范围不会扩展到父视图之外，另外如果触摸到两个重叠的视图，z-index 高的元素会优先

- pointerEvents: 相当于 H5 的 pointer-events，控制当前视图是否可以作为触控事件的目标

    - auto: 视图可以作为触控事件的目标

    - none: 视图不能作为触控事件的目标

    - box-none: 视图自身不能作为触控事件的目标，但其子视图可以。类似于你在 CSS 中这样设置

```css
.box-none {
     pointer-events: none;
}
.box-none * {
     pointer-events: all;
}
```

    - box-only: 视图自身可以作为触控事件的目标，但其子视图不能。类似于你在 CSS 中这样设置

```css
.box-none {
     pointer-events: all;
}
.box-none * {
     pointer-events: none;
}
```

- removeClippedSubviews: 为 true 时，屏幕外的子视图会被移除，提升性能。要让此属性生效，首先要求视图有很多超出范围的子视图，并且子视图和容器视图（或它的某个祖先视图）都应该有样式 overflow: hidden

- onStartShouldSetResponder(event) => [true | false]: 视图是否要响应 touch start 事件，默认返回 false，event 是上方合成事件

- onMoveShouldSetResponder(event) => [true | false]: 视图是否要响应 touch move 事件，每当有 touch move 事件在这个视图中发生，并且这个视图没有被设置为这个 touch move 的响应时，这个函数就会被调用，默认返回 false，event 是上方合成事件。经过测试得到如下结果：

    - onStartShouldSetResponder true， onMoveShouldSetResponder false，会触发一次 onStartShouldSetResponder，不会触发 onMoveShouldSetResponder，然后正常运行 onResponderGrant 与 onResponderMove

    - onStartShouldSetResponder true， onMoveShouldSetResponder true，效果同上

    - onStartShouldSetResponder false， onMoveShouldSetResponder true，会触发一次 onStartShouldSetResponder，再触发 onMoveShouldSetResponder，然后正常运行 onResponderGrant 与 onResponderMove

    - onStartShouldSetResponder false， onMoveShouldSetResponder false，会触发一次 onStartShouldSetResponder，然后移动时不断触发 onMoveShouldSetResponder，然后不能执行 onResponderGrant 与 onResponderMove

- onStartShouldSetResponderCapture(event) => [true | false]: 相当于 H5 的事件捕获，当父视图和子视图重叠，如果父视图想要阻止子视图响应 touch start 事件，它就应该设置这个方法并返回 true（试了下好像不止是阻止 touch start，touch move 也会阻止掉）

- onMoveShouldSetResponderCapture(event) => [true | false]: 相当于 H5 的事件捕获，当父视图和子视图重叠，如果父视图想要阻止子视图响应 touch move 事件时，它就应该设置这个方法并返回 true

    - 当 onStartShouldSetResponderCapture false, onMoveShouldSetResponderCapture true 时，只能阻止子视图的 move 事件，会触发
    
        - 子视图的 touch start 流程（onStartShouldSetResponder，onResponderGrant 等）
        
        - 然后才触发父视图的 onMoveShouldSetResponderCapture => onResponderGrant => onResponderMove（不会触发父视图的 onStartShouldSetResponder、onMoveShouldSetResponder）

    - 当 onStartShouldSetResponderCapture true，无论 onMoveShouldSetResponderCapture 是什么，都会阻止子视图全部事件，会触发

        - 父视图的 onStartShouldSetResponderCapture => onResponderGrant => onResponderMove（不会触发父视图的 onMoveShouldSetResponderCapture、onStartShouldSetResponder、onMoveShouldSetResponder）

- onResponderGrant(event) => void: 视图开始响应触摸事件

- onResponderMove(event) => void: 用户正在屏幕上移动手指时调用这个函数

- onResponderRelease(event) => void: 触摸操作结束时触发

- onResponderReject(event) => void: 响应者现在“另有其人”而且暂时不会“放权”

- onResponderTerminationRequest(event) => true: 有其他组件请求接替响应者，当前的 View 是否“放权”？返回 true 的话则释放响应者权力（例如父子视图重叠，子视图移动会触发父视图想拿权，如果返回 true，会执行子视图的 onStartShouldSetResponder => onResponderGrant，然后执行父视图的 onMoveShouldSetResponder => onResponderGrant => onResponderMove）

- onResponderTerminate(event) => void: 响应者权力已经交出。这可能是由于其他 View 通过onResponderTerminationRequest请求的，也可能是由操作系统强制夺权（比如 iOS 上的控制中心或是通知中心）

- onLayout: 组件挂载或者布局变化的时候调用，参数为 { nativeEvent: { layout: { x, y, width, height } } }

> 这个事件会在布局计算完成后立即调用一次，不过收到此事件时新的布局可能还没有在屏幕上呈现，尤其是一个布局动画正在进行中的时候

- collapsable(Android): 如果一个 View 只用于布局它的子组件，则它可能会为了优化而从原生布局树中移除。 把此属性设为 false 可以禁用这个优化，以确保对应视图在原生结构中存在

