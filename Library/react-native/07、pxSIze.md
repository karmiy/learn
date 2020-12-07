## px 转换

同 H5 rem，可以根据设计稿自动算出应该设置的宽高

```ts
import {Dimensions} from 'react-native';

// 获取设备宽
const deviceWidthDp = Dimensions.get('window').width;

// UI 稿的图宽
const uiWidthPx = 375;

function pxSize(uiElementPx: number) {
    return (uiElementPx * deviceWidthDp) / uiWidthPx;
}

export default pxSize;
```