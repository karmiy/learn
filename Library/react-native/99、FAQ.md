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