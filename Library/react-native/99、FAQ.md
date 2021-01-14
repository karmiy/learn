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