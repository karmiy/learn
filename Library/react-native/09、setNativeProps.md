## setNativeProps

有时我们可能希望像 H5 开发一样，不使用 state 去驱动视图渲染，而是直接操作 DOM

这在某些场景下是有更好的性能的，可以避免渲染组件结构和同步太多视图变化所带来的大量开销

在 RN 中也一样，如果希望手动去操作原生视图，可以使用 setNativeProps

### setNativeProps 与 TouchableOpacity

TouchableOpacity 实际上也是在内部使用 setNativeProps 更新组件透明度的

```tsx
setOpacityTo(value) {
    // Redacted: animation related code
    this.refs[CHILD_REF].setNativeProps({
        opacity: value
    });
},
```

如果不使用 setNativeProps 来实现这一需求，那么一种可能的办法是把透明值保存到 state 中，然后在 onPress 事件触发时更新这个值

这一做法会消耗大量的计算 —— 每一次透明值变更的时候 React 都要重新渲染组件结构，即便视图的其他属性和子组件并没有变化

### 复合组件与 setNativeProps

由于复合组件不是单纯的原生视图，如:

```tsx
const MyButton = (props) => {
    return (
      <View style={{marginTop: 50}}>
        <Text>{props.label}</Text>
      </View>
    )
}

export default App = () => {
    return (
      <TouchableOpacity>
        <MyButton label='Press me!' />
      </TouchableOpacity>
    )
}
```

所以 TouchableOpacity 内部对其的 setNativeProps 操作将会出错（试了下好像不会，官方说会？）

解决方案：

- 在复合组件内创建 setNativeProps 方法，进行二次传递（注意需要 {...props} 往下传递其他参数，因为 TouchableOpacity 还有传其他参数下去）

```tsx
const MyButton = (props) => {
    setNativeProps = (nativeProps) => {
        _root.setNativeProps(nativeProps);
    }

    return (
        <View style={{marginTop: 50}} ref={component => _root = component} {...props}>
            <Text>{props.label}</Text>
        </View>
    )
}

export default App = () => {
    return (
        <TouchableOpacity>
            <MyButton label='Press me!' />
        </TouchableOpacity>
    )
}
```

### setNativeProps 清空 TextInput 内容

可以使用 setNativeProps 清空输入框的内容

```tsx
const inputRef = useRef<TextInput>(null);

useEffect(() => {
    setTimeout(() => {
        inputRef.current?.setNativeProps({
            text: '',
        });
    }, 3000);
}, []);

return <TextInput ref={inputRef} />;
```

## 其他原生方法

- measure((x, y, width, height, pageX, pageY) => void): 测量元素位置、宽高

```tsx
const App: React.FC = () => {
    const viewRef = useRef(null);

    return (
        <View>
            <View ref={viewRef} style={styles.box} />
            <TouchableOpacity
                onPress={() => {
                    (viewRef.current as any).measure(
                        (
                            x: number,
                            y: number,
                            width: number,
                            height: number,
                            pageX: number, // 离屏幕左侧距离
                            pageY: number, // 离屏幕上侧距离
                        ) => {
                            console.log(x, y, width, height, pageX, pageY);
                        },
                    );
                }}>
                <Text>获取</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 200,
        height: 200,
        backgroundColor: 'red',
    },
});
```

> 在 useEffect 里是无法立即拿到的，需要等 native 渲染完成，如果需要尽可能快的获取，可以在 View 上使用 onLayout 这个 prop

- measureInWindow((x, y, width, height) => void): 测量元素到视图窗口的位置、宽高

```tsx
const App: React.FC = () => {
    const viewRef = useRef(null);

    return (
        <View>
            <View style={styles.wrap}>
                <View ref={viewRef} style={styles.box} />
            </View>
            <TouchableOpacity
                onPress={() => {
                    (viewRef.current as any).measureInWindow(
                        (
                            x: number, // 离屏幕左侧距离
                            y: number, // IOS 和 Android 似乎不一样？IOS 好像是离屏幕上方距离，Android 是离状态栏（24 高度）的距离（即安卓上元素在顶部，会是 -24）
                            width: number,
                            height: number,
                        ) => {
                            console.log(x, y, width, height, pageX, pageY);
                        },
                    );
                }}>
                <Text>获取</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        width: 300,
        height: 300,
        marginTop: 40,
        marginLeft: 10,
        padding: 40,
        backgroundColor: 'pink',
    },
    box: {
        width: 200,
        height: 200,
        backgroundColor: 'red',
    },
});
```