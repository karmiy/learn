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


### Props

- selectable: 用户是否可以长按选择文本，以便复制和粘贴

- ellipsizeMode: 超出时如何用省略号修饰，通常配合 numberOfLines

    - head: '...efg'

    - middle: 'ab...yz'

    - tail: 'abcd...'

    - clip: 不显示省略号直接从尾部截断

- numberOfLines: 用来当文本过长的时候裁剪文本。包括折叠产生的换行在内，总的行数不会超过这个属性的限制

> [嵌套文本元素不支持 numberOfLines](https://github.com/facebook/react-native/issues/22811)

- onLayout: 加载时或者布局变化以后调用，参数为 {nativeEvent: {layout: {x, y, width, height}}}

- onTextLayout: 同 onLayout，但 event 是合成事件 [TextLayoutEvent](https://www.react-native.cn/docs/text#textlayoutevent)，其中有个 nativeEvent.lines 属性，是个数组，每一项是 [TextLayout](https://www.react-native.cn/docs/text#textlayout) { x: number, y: number, width: number, height: number, ascender: number, capHeight: number, descender: number, text: string, xHeight: number }

- onLongPress: 文本被长按回调

- onPress: 文本被点击回调

- allowFontScaling: 控制字体是否要根据系统的“字体大小”辅助选项来进行缩放。默认值为 true

- adjustsFontSizeToFit(iOS): 字体是否随着给定样式的限制而自动缩放

- minimumFontScale(iOS): 当 adjustsFontSizeToFit 开启时，指定最小的缩放比（即不能低于这个值）。可设定的值为 0.01 - 1

- suppressHighlighting (iOS): 为 true 时，当文本被按下会没有任何视觉效果。默认情况下，文本被按下时会有一个灰色的、椭圆形的高光

- selectionColor(Android): 文本的高亮颜色 

- dataDetectorType(Android): 确定文本元素中转换为可单击 url 的数据类型。默认情况下，不检测数据类型，enum('phoneNumber', 'link', 'email', 'none', 'all')

## TextInput

输入框组件，通常是 value 配合 onChangeText 的受控组件

需要注意：

- Android 上默认有底边框，同时有一些 padding（上下左右都有一些），如果希望看起来和 IOS 尽量一致需要设置 padding: 0

- Android 上长按选择文本会导致 windowSoftInputMode 设置变为 adjustResize，这样可能导致绝对定位的元素被键盘给顶起来，需要在 AndroidManifest.xml 中明确指定合适的 [windowSoftInputMode](https://developer.android.com/guide/topics/manifest/activity-element.html) 值，或是自己监听事件来处理布局变化

### Props

- style: 并不是所有样式都支持，不支持 borderXXXWidth 与 borderXXXYYYRadius

- defaultValue: 默认值，在简单场景不使用 value 受控时可以使用

- value: 受控值，不过有些场景会有闪烁现象

    - 闪烁现象 1: 通过不改变 value 来阻止用户进行编辑（应该使用 editable: false）y'ygg

    - 闪烁现象 2: 通过 value 限制最大长度（应使用 maxLength）

- allowFontScaling: 控制字体是否要根据系统的“字体大小”辅助选项来进行缩放。默认值为true

- multiline: 为 true 时可以多行，默认 false，Android 上如果为 false，文本默认垂直居中，需要配合 textAlignVertical

> 为 false 时添加某一边框的样式如 borderBottomColor、borderLeftWidth 不能生效，需要自行外层包裹 View 将边框设置在上面

> 多行默认是不限制最大行数的，如果希望有最大行数，可以加个 style.maxHeight 来控制

- autoCapitalize: 是否自动将特定字符切换为大写，注意并不是输入完后输入框上的字符自动变大写，而是如配置 'words'，则键盘打第一个字符时，键盘左下角大写按钮会高亮，使我们打的第一个字符会是大写而已，不过有些键盘类型不支持（如 name-phone-pad）

    - autoCapitalize: 所有字符

    - words: 每个单词的第一个字符

    - sentences: 每句话的第一个字符（默认）

    - none: 不切换

- autoCorrect: 为 false，会关闭拼写自动修正。默认值是 true

- autoFocus: 为 true，在componentDidMount后会获得焦点。默认值为 false

- blurOnSubmit: 为 true 时，文本框会在提交的时候失焦（即点键盘右下角的确认按钮），单行输入框默认 true，多行默认 false（多行输入框若设为 true，则在按下回车时就会失去焦点同时触发 onSubmitEditing 而不会触发换行）

- caretHidden: 为 true 则隐藏光标

- contextMenuHidden: 是否隐藏菜单栏（输入框长按内容后会出现选择/全选的菜单栏）

- editable: 为 false 时，文本框是不可编辑的

- keyboardType: 弹出何种软键盘类型

    - 任何平台都支持

        - default

        - number-pad

        - decimal-pad

        - numeric

        - email-address

        - phone-pad

    - iOS

        - ascii-capable

        - numbers-and-punctuation

        - url

        - name-phone-pad

        - twitter

        - web-search

    - Android

        - visible-password

- maxLength: 限制文本框中最多的字符数。使用这个属性而不用 JS 逻辑去实现，可以避免闪烁的现象

- placeholder: 同 H5

- placeholderTextColor: placeholder 的字体颜色

- returnKeyType: 决定“确定”按钮显示的内容

    - 任何平台都支持

        - done

        - go

        - next

        - search

        - send

    - iOS

        - default

        - emergency-call

        - google

        - join

        - route

        - yahoo

    - Android

        - none

        - previous

- secureTextEntry: 为 true 时，输入框会像 H5 password 一样，之前输入的文本变成 * 号 

- selection: 设置选中文字的范围（指定首尾的索引值，{ start: number,end: number }）。如果首尾为同一索引位置，则相当于指定光标的位置

- selectionColor: 文本选中后高亮颜色

- selectTextOnFocus: 为 true 时，当获得焦点的时候，所有的文字都会被选中

- textAlign: 文本水平方向的位置，enum('left', 'center', 'right')

- onBlur: 文本框失去焦点的时候调用此回调函数

- onChange: 文本框内容变化时调用此回调函数。回调参数为{ nativeEvent: { eventCount, target, text} }

- onChangeText: 文本框内容变化时调用此回调函数，通常作为受控组件的 set 部分

- onContentSizeChange: 输入框大小变化时调用，e 参数的结构为 { nativeEvent: { contentSize: { width, height } } }，在输入框初始化时就会调用，如果是多行，再换行改变高度也会触发

- onEndEditing: 文本输入结束后调用此回调函数

- onFocus: 文本框获得焦点的时候调用此回调函数。回调参数为 { nativeEvent: { target } }

- onKeyPress: 一个键被按下的时候调用此回调。传递给回调函数的参数为{ nativeEvent: { key: keyValue } }，其中keyValue即为被按下的键。会在 onChange 之前调用

> 在 Android 上只有软键盘会触发此事件，物理键盘不会触发

- onLayout: 组件加载或者布局变化的时候调用，回调参数为{ nativeEvent: {layout: {x, y, width, height}, target } }

- onScroll: 在内容滚动时持续调用（通常是多行时，换行就会触发，然后如果设置最大高度，滚动时也持续触发），传回参数的格式形如{ nativeEvent: { contentOffset: { x, y } } }。也可能包含其他和滚动事件相关的参数

> Android 上，出于性能考虑，不会提供 contentSize 参数

- onSelectionChange: 长按选择文本时，选择范围变化时调用此函数（试了下连打字时都会触发。。。），传回参数的格式形如 { nativeEvent: { selection: { start, end } } }。需要设置 multiline={true}

- onSubmitEditing: 点击软键盘右下角确定提交按钮时，调用此回调，参数为{nativeEvent: {text, eventCount, target}}，多行不可用，因为多行右下角按钮是用来换行的

> iOS 中在 keyboardType='phone-pad' 时不会触发

- onTextInput: 输入框输入时回调（官方说需要 multiline 多行时才行，试了下不需要），参数是 { nativeEvent: { text, previousText, range: { start, end } } }

- numberOfLines(Android): 输入框的行数。当 multiline 设置为 true 时使用它，可以占据对应的行数

- autoComplete(Android): 是否开启自动完成提示（貌似改为 autoCompleteType 了），enum('off', 'username', 'password', 'email', 'name', 'tel', 'street-address', 'postal-code', 'cc-number', 'cc-csc', 'cc-exp', 'cc-exp-month', 'cc-exp-year')

- disableFullscreenUI(Android): 为 false 时, 如果 text input 的周围有少量可用空间的话（比如说，当手机横过来时），操作系统可能会将这个 text input 设置为全屏模式，默认 false

- inlineImageLeft(Android): 指定一个图片放置在左侧。图片必须放置在/android/app/src/main/res/drawable目录下，经过编译后按如下形式引用（无路径无后缀）

```tsx
<TextInput
    inlineImageLeft='search_icon'
/>
```

- inlineImagePadding(Android): 给放置在左侧的图片设置 padding 样式

- returnKeyLabel(Android): 替换 returnKeyType，是任意字符串

- underlineColorAndroid(Android): 文本框的下划线颜色(如果要去掉文本框的边框，请将此属性设为透明 transparent)

- clearButtonMode(iOS): 是否在文本框右侧显示 “清除” 按钮，仅在单行下有效，默认 'never'

    - never: 不要清除按钮

    - while-editing: 文本不为空且正在编辑中

    - unless-editing: 文本不为空且不在编辑中状态

    - always: 总是有清除按钮

- clearTextOnFocus(iOS): 为 true，则每次聚焦时都会清空文本框内容

- dataDetectorTypes(iOS): 设置 text input 内能被转化为可点击 URL 的数据的类型。当且仅当multiline={true}和editable={false}时起作用。默认情况下不检测任何数据类型，enum('phoneNumber', 'link', 'address', 'calendarEvent', 'none', 'all') 或此 enum 的数组

- enablesReturnKeyAutomatically(iOS): 为 true 时，键盘会在文本框内没有文字的时候禁用确认按钮。默认值为 false

- keyboardAppearance(iOS): 指定键盘的颜色，enum('default', 'light', 'dark')

- scrollEnabled(iOS): 为 true 时滚动禁用，在 multiline 多行时有效

- spellCheck(iOS): 为 false 时禁用拼写检查的样式（比如错误拼写的单词下的红线）。默认值继承自 autoCorrect

### 方法

- focus: 让输入框聚焦

- blur: 让输入框失去焦点

- clear: 清空输入框内容

- isFocused: 当前输入框是否获得了焦点