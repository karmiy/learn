## 关于 TouchableWithoutFeedback 的性质与 onPress

- TouchableWithoutFeedback 是个抽象组件，不会在 children 的最外层多包裹一层 View

- TouchableWithoutFeedback 不能应用在自定义组件上，否则无法触发 onPress，只能应用在 RN 原生组件上

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

## 关于 z-index

安卓下的层级，需要设置 elevation

```tsx
StyleSheet.create({
    wrapper: {
        zIndex: 100,
        elevation: 100,
    },
})
```

## Text 的 borderRadius

IOS 中，Text 使用圆角 borderRadius 需要配合 overflow hidden 才能生效:

```tsx
StyleSheet.create({
    wrapper: {
        borderRadius: 100,
        overflow: 'hidden',
    },
})
```

## TextInput 点击外围不能失去焦点

需要将 TextInput 包装在 ScrollView 里并配合 keyboardShouldPersistTaps 配置

- [onBlur doesn't work when clicking anywhere but another TextInput](https://github.com/facebook/react-native/issues/11071)

```tsx
<ScrollView keyboardShouldPersistTaps='handled'>
    <TextInput onBlur={() => console.log('blur')} />
</ScrollView>
```

- 如果希望点击旁边其他的 TextInput，或点可以捕获点击事件的元素，可以不让键盘收起，可以设置 keyboardShouldPersistTaps 为 handled 或 always

- 如果希望点击空白可以收起键盘，可以在 ScrollView 最外层包装一个 Touch 并在点击时利用 Keyboard 收起键盘

```tsx
<ScrollView keyboardShouldPersistTaps='always'>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        ...
    </TouchableWithoutFeedback>
</ScrollView>
```

## padding 与 backgroundColor rgba 颜色不匹配

在给一个元素设置 rgba 的背景色，且该元素有 padding 时，padding 处的颜色会与背景色不匹配

解决方案: padding 放到内部元素，不要与 backgroundColor 同时作用

## 子元素 absolute width/height 100% 与父级宽高不匹配

RN 里的定位与 H5 略有不同

- H5 中即使父元素有 padding，子元素定位的 width/height 100% 也包含 padding 部分

- RN 中不包含父元素 padding 部分，如果需要可以使用 top/right/bottom/left 0

## 子元素 absolute top/left 100% 与父级宽高不匹配

- RN 中使用 absolute，如果定位父级没有设置宽度，只是被子元素自动撑开的话，absolute 元素设置宽 100% 会识别不到定位父级宽，会随再上级（父级的父级），高度同理

## Image 定位 top/right/bottom/left 0 宽高不压缩

Image 使用 top/right/bottom/left 0 后依然会是图片自身大小，不能压缩

解决方案: 多包裹一层 View top/right/bottom/left 0，Image 宽高设为 100%

## TextInput 使用 lineHeight 在输入中文 + 数字时文本跳动

在 IOS 中，如果 multiline 为 false 的 TextInput（单行）使用 lineHeight，在输入过程中输入了中文 + 数字，在打数字时会出现文本跳动

解决方案: 不使用 lineHeight，仅使用 fontSize 控制文本大小

## display: none 与 position: absolute 不兼容

安卓下如果设置了 absolute 定位，则 display: none 无效

解决方案：

- scale: 0 缩放为不可见大小（但是如果有 left, top, right, bottom: 0 会有问题）

- witdh:0, height: 0, overflow: hidden

## RN 里怎么实现三角箭头

设置 borderWidth 为 width/height 的一半，使得内容大小刚好为 0:

```tsx
const arrowStyle = {
    width: 18,
    height: 18,
    borderTopWidth: 9,
    borderTopColor: 'pink',
}
```

## ScrollView 不受 absolute 影响内容大小

- H5: 一个滚动元素（如 overflow: auto）内有一个 absolute 元素，这个定位元素宽高，会影响滚动元素的滚动内容大小（如这个 absolute 元素高度是 1000vh，那么滚动元素是可以滚到 1000vh 这么多的位置的）

- RN: 与 H5 不同，ScrollView 内部的 absolute 元素不影响 ScrollView 滚动内容，即使一个 absolute 元素高度有 10 个屏幕高，但是 ScrollView 里的其他只有 2 个屏幕高，滚动范围也只有 2个 屏幕高

## 点击定位元素

元素设置 absolute 后，Android 下如果定位后的位置在父级之外（如父级只有 100 * 100，定位了 left: 101），会导致 Touch 类组件点击无效

解决方案：

- 加长父级宽度，使其不超出

- 定位后需要 zIndex，设 1 也行，完全不设置可能还是点不了

## Android 嵌套 ScrollView，内部 ScrollView 无法滚动

配置 nestedScrollEnabled（注：ScrollView 不能超出容器，如果定位在父级 View 外，否则也无法滚动）

## Android 下如果节点高度由内容区域自适应，调用 measure 无法获取到数据

解决方案：

- 同时给节点设置 onLayout，即使是个弄函数也行，否则 Android 下 measure 拿到的数据都是 undefined

## 父级 height: 0，子节点高度根据内容自适应时无法获取高度

RN 中当父级设置了 height: 0，且子节点非设置定值，而是根据内容自适应时

使用 onLayout 或 measure 都无法获取高度，将会得到 0

解决方案：

- 设置父级高度为 0.00.....1