## TouchableHighlight

按下后会有暗色背景

### Props

继承至 TouchableWithoutFeedback

- activeOpacity: 被封装的视图（按钮里的内容）触摸后不透明度值，默认 0.85

- underlayColor: 按下时的底色

- onHideUnderlay: 底层的颜色被隐藏的时候调用（放手时）

- onShowUnderlay: 当底层的颜色被显示的时候调用（试了下好像按下和放手都会）

## TouchableOpacity

按下时内容会变透明

内部是通过封装在一个 Animated.View 中来实现的

### Props

继承至 TouchableWithoutFeedback

- activeOpacity: 被封装的视图（按钮里的内容）触摸后不透明度值，默认 0.2

### 方法

- setOpacityTo((value: number), (duration: number)): 将本组件的不透明度设为指定值（伴有过渡动画）

## TouchableWithoutFeedback

在处理点击事件的同时不显示任何视觉反馈使用（这个组件貌似是抽象组件，不会像其他组件一样相当于一个 View）

> 注意：TouchableWithoutFeedback 下只能是 RN 原生组件才能触发的了 onPress，自定义组件不能触发

```tsx
{/* 点击可以触发 onPress */}
<TouchableWithoutFeedback onPress={() => console.warn('...')}>
    <Text>点击<Text>
</TouchableWithoutFeedback>
```

```tsx
const Component = () => <Text>点击<Text>

{/* 点击不能触发 onPress */}
<TouchableWithoutFeedback onPress={() => console.warn('...')}>
    <Component />
</TouchableWithoutFeedback>
```

- delayLongPress: 从 onPressIn 开始，到 onLongPress 被调用的延迟。单位是毫秒

- delayPressIn: 从触摸操作开始到 onPressIn 被调用的延迟。单位是毫秒

- delayPressOut: 从触摸操作结束开始到 onPressOut 被调用的延迟。单位是毫秒

- disabled: 是否禁用

- hitSlop: 定义按钮外延范围，即点按钮周围多远也算点到按钮，结构为 { top: number, left: number, bottom: number, right: number }

> 注：经过测试加在 TouchableWithoutFeedback 本身无效，因为它不渲染出多余节点，而是给它包裹的 View 加 hitSlop 配置，其他如 TouchableOpacity 有效，因为它们回渲染出外壳节点

> 触摸范围不会扩展到父视图之外，另外如果触摸到两个重叠的视图，z-index 高的元素会优先

- onBlur: 失去焦点时触发

- onFocus: 聚焦时触发

- onLayout: 加载或者布局改变的时候被调用，事件参数 { nativeEvent: { layout: { x, y, width, height } } }

- onLongPress: 长按后触发，根据 delayLongPress 的时间识别多久是长按

- onPress: 点击事件

- onPressIn: 按下时调用，在 onPress 之前

- onPressOut: 放手时调用，在 onPress 之前

- pressRetentionOffset: 设置视图外一个额外距离，使得在 onPressout 触发前，这个范围内也可以被视为 press 事件，参数 { top: number, left: number, bottom: number, right: number }（如设置 80，则按下后不放手往上移动，移动到里按钮 80 的距离内放手还是会触发 press 事件，超出 80 则在到达 80 时触发 onPressOut，然后超出 80 后放手不会触发 onPress）