## KeyboardAvoidingView

解决键盘问题：键盘弹起时遮挡当前视图，该组件可以自动根据键盘高度，调整自身 height 或 paddingBottom

```tsx
<KeyboardAvoidingView
    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    style={styles.container}
>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.inner}>
        <Text style={styles.header}>Header</Text>
        <TextInput placeholder='Username' style={styles.textInput} />
        <View style={styles.btnContainer}>
            <Button title='Submit' onPress={() => null} />
        </View>
    </View>
    </TouchableWithoutFeedback>
</KeyboardAvoidingView>
```

- behavior: 表示如何对键盘作出响应，enum('height', 'position', 'padding')

- contentContainerStyle: 如果设定 behavior 值为'position'，则会生成一个 View 作为内容容器。此属性用于指定此内容容器的样式

- enabled: 是否启用

- keyboardVerticalOffset: 有时候应用离屏幕顶部还有一些距离（比如状态栏等等），利用此属性来补偿修正这段距离

## Modal

可以实现一个模态框，会在页面上挂载一个全屏元素，用 children 部分填充自定义布局，不会受父级元素定位影响

> 顺带一提，抽屉组件可以考虑 react-native-drawer 组件

### Props

- visible: 是否可见

- supportedOrientations(iOS): 指定在设备切换横竖屏方向时，modal 会在哪些屏幕朝向下跟随旋转（iOS 上，除了本属性外，还会受到应用的 Info.plist 文件中UISupportedInterfaceOrientations的限制。如果还设置了presentationStyle属性为pageSheet或formSheet，则在 iOS 上本属性将被忽略）

- onRequestClose(Android, Platform.isTVOS): 回调会在用户按下 Android 设备上的后退按键或是 Apple TV 上的菜单键时触发（务必注意本属性在 Android 平台上为必填，且会在 modal 处于开启状态时阻止BackHandler事件）

- onShow: 在 modal 显示时调用

- onDismiss: 在 modal 关闭时调用

- transparent: 背景是否透明，默认白色

- animationType: 动画，enum('none', 'slide', 'fade')，默认 'none'

    - slide: 从底部滑入滑出

    - fade: 淡入淡出

- hardwareAccelerated(Android): 是否强制启用硬件加速来绘制弹出层

- statusBarTranslucent(Android): 决定 modal 是否应该在系统状态栏下面

- onOrientationChange(iOS): 模态窗显示的时候，当设备方向发生更改时，将调用onOrientationChange回调方法。 提供的设备方向仅为“竖屏”或“横屏”。 无论当前方向如何，也会在初始渲染时调用此回调方法

- presentationStyle(iOS): 决定 modal（在较大屏幕的设备比如 iPad 或是 Plus 机型）如何展现，默认会根据transparent属性而设置为 overFullScreen 或是 fullScreen

    - fullScreen: 完全盖满屏幕

    - pageSheet: 竖直方向几乎盖满，水平居中，左右留出一定空白（仅用于大屏设备）

    - formSheet: 竖直和水平都居中，四周都留出一定空白（仅用于大屏设备）

    - overFullScreen: 完全盖满屏幕，同时允许透明

## Pressable

检测任何子组件的 press 事件

```tsx
<Pressable
    onPress={() => {
        console.log('press');
    }}
    style={({pressed}) => [
        {
            backgroundColor: pressed
                ? 'rgb(210, 230, 255)'
                : 'white',
        },
    ]}
>
    {({pressed}) => (
        <Text>{pressed ? 'Pressed!' : 'Press Me'}</Text>
    )}
</Pressable>
```

### props

- android_disableSound(Android): 配置安卓按下时是否不要播放声音

- android_rippleColor(Android): 配置安卓按下时涟漪效应的颜色

- children: 常规 React 节点，或一个函数，接收 press 状态并返回 React 节点

- delayLongPress: 默认 500，即长按事件 onLongPress 调用前长按时间

- disabled: 是否禁用 press 事件

- hitSlop: 设置元素外一个额外距离，让这个范围里也可以监听到 press 事件，防止用户胖手指

- pressRetentionOffset: 设置视图外一个额外距离，使得在 onPressout 触发前，这个范围内也可以被视为 press 事件

- onPressIn: 按键被激活时调用

- onPress: 按键动作被触发时调用，在 onPressIn 130ms 后

- onLongPress: 当按下手势在 onPressIn 500ms 或 delayLongPress 配置时间之后才调用

- onPressOut: 按下手势失效时调用

- style: 样式，同 children 也可以是接收 press 状态的函数