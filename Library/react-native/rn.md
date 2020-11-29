## 核心组件

| RN 组件 | Web 元素 | 说明 |
| ------ | ------ | ------ |
| View | div | 容器 |
| Text | p | 展示文本 |
| Image | img | 展示图片 |
| ScrollView | div | 相当于 overflow: auto 的 div，如果放在页面最外层，会自适应占满剩余高度保证页面没有滚动条，如果没有包裹 ScrollView，页面甚至不能滚动 |
| TextInput | input | 输入框 |

## 样式

RN 中使用 StyleSheet.create 来创建样式

```tsx
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    thumbnail: {
        width: 53,
        height: 81
    }
});

<Image style={styles.thumbnail} />
```

## Button

- title: 按钮文本，代替 children 用法

- onPress: 相当于平时的 onClick

- disabled: 禁用

## TextInput

- defaultValue: 默认值

- value: 同 H5 input 受控组件的 value

- onChangeText: 同 H5 input 受控组件 onChange

- placeholder: 同 H5 input

## Image

- source: 对象结构

    - url: 同 H5 img.src

    - width: 宽

    - height: 高

## ScrollView

适合放内容不多的滚动元素，因为内容都会被 render，即使在视图外

通常内容多时会使用 FlatList

- pagingEnabled: 以页为单位，每次滚动一页，试一试即知

- maximumZoomScale: 最大手势缩放大小

- minimumZoomScale: 最小手势缩放大小

## FlatList

显示垂直的滚动列表，适合长列表数据

与 ScrollView 不同的是，它不会立即渲染全部元素，而是优先渲染屏幕上可见元素

```tsx
<FlatList
    data={[
        {id: 1, name: 'k1'},
        {id: 2, name: 'k2'},
    ]}
    renderItem={({item}) => (
    <Text>
        id: {item.id}; name: {item.name}
    </Text>
    )}
/>
```

## SectionList

滚动列表需要分组标签时使用

```tsx
// 需要 data 属性作为组里的列表
<SectionList
    sections={[
        {
            header: 'A',
            data: [
                {id: 1, name: 'k1'},
                {id: 2, name: 'k2'},
            ],
        }
    ]}
    renderItem={({item}) => (
        <Text>
            id: {item.id}; name: {item.name}
        </Text>
    )}
    renderSectionHeader={({section}) => <Text>{section.header}</Text>}
    keyExtractor={(item, index) => index}
/>
```

## Platform

检测当前运行平台

```tsx
import { Platform } from 'react-native';

const platform = Platform.OS; // 'ios' / 'android' 
```

此外还有更为实用的 select 方法，以 Platform.OS 为 key，会根据平台返回不同的值

```tsx
const platform = Platform.select({
    ios: 1,
    android: 2,
}); // IOS 返回 1，安卓返回 2
```

### 检测 Android 版本

在 Android 上，Version属性是一个数字，表示 Android 的 api level

```tsx
if (Platform.Version === 25) {
    console.log('Running on Nougat!');
}
```

### 检测 IOS 版本

在 iOS 上，Version属性是-[UIDevice systemVersion]的返回值，具体形式为一个表示当前系统版本的字符串。比如可能是 '10.3'

```tsx
const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
    console.log('Work around a change in behavior');
}
```

### 特定平台扩展名

RN 会自动检测文件是否有 .ios 或 .android 的拓展名加载正确的文件

如创建了组件 BigButton:

```
BigButton.ios.js
BigButton.android.js
```

代码中引入:

```tsx
import BigButton from './BigButton';
```

引入时不需要扩展名，RN 会自动根据平台引入正确的文件

如果希望在 WEB 端复用 RN 代码，还可以使用 .native 扩展名，此时 IOS 和 Android 都会使用该文件，WEB 端使用没有拓展名的文件:

```tsx
Container.js // WEB
Container.native.js // IOS / Android
```

```tsx
import Container from './Container';
```
## 强制刷新

如果希望重置 state，可以在文件任何地方增加:

```tsx
// @refresh reset
```

指示在每次编辑时重新加载该文件中定义的组件
