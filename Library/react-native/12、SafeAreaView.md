## SafeAreaView

在一个“安全”的可视区域内渲染内容

因为有 iPhoneX 这种刘海屏，所以需要避免内容渲染到不可见的刘海里

此组件**仅支持 iOS 即 iOS 11 或更高**

SafeAreaView 会根据系统的：

- 各种导航栏

- 工具栏

等预留出空间渲染内部内容，还会考虑设备屏幕局限（四周圆角或顶部中间不可显示的刘海区域）

```tsx
const App = () => {
    // 没有 SafeAreaView，Text 内容会在刘海屏置顶
    // 有 SafeAreaView，Text 内容会在刘海下面
    return (
        <SafeAreaView style={styles.container}>
            <Text>Page content</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
```

### props

继承了 ViewProps，**[不支持 padding 设置](https://github.com/facebook/react-native/issues/22211)，因为组件内部为了实现这个效果，使用了 padding**