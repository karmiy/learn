## StatusBar

控制应用状态栏的组件

可以放在任意地方，多个且后加载的会覆盖先加载的

### 常量

- currentHeight(Android): 状态栏当前高度

```tsx
StatusBar.currentHeight
```

### Props

- animated: 状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle 和 hidden

- backgroundColor(Android): 状态栏的背景色

- barStyle: 状态栏文本的颜色

    - default: iOS 白底黑字、Android 黑底白字

    - light-content: 黑底白字

    - dark-conent: 白底黑字（Android 只有 Android API >= 23 才支持）

- hidden: 是否隐藏状态栏

- networkActivityIndicatorVisible(iOS): 是否显示网络活动指示符（网络旁边的菊花，试了下没看到）

- showHideTransition(iOS): 通过 hidden 属性来显示或隐藏状态栏时所使用的动画效果。enum('fade', 'slide')，默认值为 'fade'

- translucent(Android): 状态栏是否透明。为 true 时，应用会延伸到状态栏之下绘制（即所谓 “沉浸式”，原本页面内容是从状态栏下方开始绘制的，这时状态栏类似 H5 中占据文档流 ，而沉浸式是从状态栏类似 H5 绝对定位了不占文档流，页面内容即从顶部开始绘制了）

### 静态方法

大部分效果同 props，似乎不推荐使用，略

## Switch

开关，是**受控组件，需要传 value 与 onValueChange**

### Props

- value: boolean，开关是否打开

- onValueChange: 开关状态改变时的回调

- disabled: 是否禁用

- trackColor: 开启时开关的背景色

- ios_backgroundColor: iOS 上自定义背景色，当开关状态 false 或禁用（开关是半透明的）时，可以看到这个背景色

- thumbColor: 开关上圆形按钮的背景颜色。在 iOS 上设置此颜色会丢失按钮的投影

## Text

显示文本的组件，支持：

- 嵌套

- 样式

- 触摸处理

### 嵌套文本

Text 里可以嵌套 Text，**子 Text 可以继承父级的样式**

```tsx
const App: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.baseText}>
                I am bold
                <Text style={styles.innerText}> and red</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    baseText: {
        fontWeight: 'bold',
    },
    innerText: {
        color: 'red',
    },
});
```
### 嵌套视图（仅限 iOS）

iOS 中还可以在 Text 里嵌套 View

```tsx
const App: React.FC = () => {
    return (
        <Text>
            There is a blue square
            <View
                style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'steelblue',
                }}
            />
            in between my text.
        </Text>
    );
};
```

### Text 容器特性

Text 在布局中与其他组件不同：

- 一个个 Text 单独放置，没有父级 Text，则会单独各自占行

- 内部元素不再是 flexbox 布局，而是文本布局（意味着 Text 内部不再是一行行矩形，而是排成一排行末折叠）

```tsx
<Text>
    <Text>First part and </Text>
    <Text>second part</Text>
</Text>

// 效果结构如下
// |First part and second part|
```

```tsx
<View>
    <Text>First part and </Text>
    <Text>second part</Text>
</View>

// 效果结构如下
// |First part and|
// |second part   |
```

### 文本节点

RN 中文本节点**必须放在 Text 组件中**，不能放在 View 里

```tsx
<Text>correct</Text>

<View>error</View>
```

### 样式继承

RN 并没有像 H5 那样，任何元素都可以继承文本样式，因为这在语义上实际并不太正确，连任何一个非文本标签如 div 都有如 font-size 的样式

RN 认为：

- 组件是被设计为强隔离性的，只要属性相同，其外观和表现都将完全相同，而如果文本可以继承外面的样式将会打破这种隔离性