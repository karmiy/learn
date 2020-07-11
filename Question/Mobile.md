## 移动端控制台

```html
<script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

## 滚动穿透

当拖动没有滚动条的元素时，会直接拖动页面滚动

经常出现在我们创建了模态框遮罩层，拖动模态框时，整个页面会跟着滚动

解决方案：

- 弹框时，固定页面不能滚动，实现略，下个案例提及

- 阻止模态框 touchmove 默认事件，但是会导致元素里有滚动元素也不能滚了

## 弹窗时固定页面不能滚动

```ts
let prevPagePostion: string, 
    prevPageTop: string,
    prevPageLeft: string; 
/**
 * @description 阻止页面滚动
 */
export const preventPageScroll = () => {
    const top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
        body = document.body;
    prevPagePostion = body.style.position;
    prevPageTop = body.style.top;
    prevPageLeft = body.style.left;

    body.style.position = 'fixed';
    body.style.top = `${-top}px`;
    body.style.left = '0';
}

/**
 * @description 恢复页面滚动
 */
export const recoverPageScroll = () => {
    const body = document.body,
        top = Math.abs(parseFloat(body.style.top));
    body.style.position = prevPagePostion;
    body.style.top = prevPageTop;
    body.style.left = prevPageLeft;
    
    document.documentElement.scrollTop = top;
    window.scrollTo(0, top);
}
```

这种方式可以在弹框时控制页面滚动，防止滚动穿透

## IOS 输入框失去焦点时页面不回弹

移动端输入框聚焦时页面会弹起，页面高度过低时，输入框在失去焦点后可能出现页面不回弹的问题

```ts
setTimeout(() => {
    document.body.scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
}, 100);
```

## IOS 橡皮筋

在 IOS 中，我们拖动页面, 某个滚动元素到边缘时会触发橡皮筋效果（Android 没有）

这原本是挺不错的体验效果，但是却引发了一些问题

**当我们在拖动一个可滚动元素时，在已经置顶或置底的情况下再次去拖动，会触发最外层整个页面的橡皮筋效果，而不是触发元素自身的橡皮筋**

这不仅可能体验上不好，还可能触发 BUG，如拖动页面橡皮筋时，模态框一些内容显示变空白

### 方案一

橡皮筋是在元素已经置顶或置底时，再次拖动会出现的现象

那么可以在开始拖动时判断是否滚动元素已经置顶或置底，如果是则阻止页面 touchmove 的默认事件，让页面无法滑动，如果滚动元素未置顶或置底，则不阻止页面 touchmove 默认事件，也就不会触发整个页面的橡皮筋：

```ts
function noBounce(scrollBox: Element) {
    let startY = 0; // 初始 touchstart 的位置

    const touchstart = (e: TouchEvent) => {
        startY = e.touches[0].screenY || e.touches[0].pageY;
    };

    const touchmove = (e: TouchEvent) => {
        const targetEle = e.target;
        if(!targetEle) return;

        const curY = e.touches[0].screenY || e.touches[0].pageY;
        const isAtTop = (startY <= curY && scrollBox.scrollTop === 0);
        const isAtBottom = (startY >= curY && scrollBox.scrollHeight - scrollBox.scrollTop === scrollBox.clientHeight);
        
        if(!scrollBox.contains(targetEle as Node) || isAtTop || isAtBottom) e.preventDefault();
    }

    document.body.addEventListener('touchstart', touchstart, { passive: false });
    document.body.addEventListener('touchmove', touchmove, { passive: false });

    return () => {
        document.body.removeEventListener('touchstart', touchstart);
        document.body.removeEventListener('touchmove', touchmove);
    };
}

noBounce(document.querySelector('.list')); // 绑定滚动元素
```

优点：

- 当滚动元素置顶或置顶时，再次拖动不会导致页面弹性拉伸

缺点：

- 由于在非置顶/底的 touchmove 中，拉到顶部或底部在 IOS 依旧会触发自身的橡皮筋，这是无法取消的，所以如果现在置顶/底时拖动页面固定死了(如开头所述，元素置顶/底时再拖动 IOS 不会触发自身橡皮筋，会触发页面的橡皮筋，机制如此)，可能比较僵有点奇怪

### 方案二：

使用 inobounce.js

inobounce.js 的源码只有 100+ 行，主要在于对 -webkit-overflow-scrolling: touch 的判断

inobounce 会在 window 下监听 touchmove 事件，并且只让具有如下条件的元素可以被拖动：

1. 元素配置了 -webkit-overflow-scrolling: touch

2. 元素配置了 overflow: auto 或 scroll

3. 元素可以滚动(内容已经超出，出现滚动条了)

4. 元素未置顶/置底

同样，会阻止以下情况的默认事件，即页面会无法被拖动：

1. 当前滑动的是页面(document, document.body)

2. 当前拖动的元素不是可以滚动的元素

3. 当前拖动的元素没有 -webkit-overflow-scrolling: touch

4. 当前拖动的元素已置顶/底

以上其实可以了解到，inobounce 的实现和方案一其实思路是一样的，只是 inobounce 是针对全局，方案一是绑定特定元素

inobounce 提供了 enable, disable, isEnabled 方法，用于开启，关闭，判断是否开启状态，并且页面一进来就会触发 enable 方法(如果页面支持 -webkit-overflow-scrolling: touch)

优点与缺点同方案一，不过封装了库，使用更方便

### 方案三

使用 better-scroll

better-scroll 是让元素假滚动，即父元素设置了 overflow: hidden 超出隐藏，配置 touchmove 事件监听滑动，使用 translateY 控制子元素偏移

优点：

- 使用简单，可配置项多样

- 模拟了元素滚动的橡皮筋效果，甚至是置顶/底时拖动的橡皮筋效果，体验好

- 元素置顶/底后拖动完美解决触发页面橡皮筋的问题，因为它设置的是超出隐藏，页面橡皮筋是在有真实滚动条的元素置顶/底时再拖动触发的

缺点：

- 滚动过程中点击让其停住时会抖动一下

- 默认点击事件等会失效，需要配置，对不熟悉者可能造成困扰
