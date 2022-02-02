## 结构性伪类选择器

    
### 兼容性

除了 E~F >= IE8

其他 >= IE9

### :nth-child(n)

该元素父级的第n个子节点，且这个子节点与该元素匹配

```css
p:nth-child(2) {
    ...
}
```

```html
<div>
    <p>...</p>
    <p>...</p> // 匹配这个p，p元素的父元素（div）的第2个子节点
    <p>...</p>
    <p>...</p>
</div>

<div>
    <p>...</p>
    <span>...</span> // 这样匹配不到，因为第二个子元素不是p元素
    <p>...</p>
    <p>...</p>
</div>
```

### :nth-last-child(n)

和:nth-child相反，从后往前

### :nth-of-type(n)

该元素父级的第n个**相同**子节点

```css
p:nth-of-type(4) {
    ...
}
```

```html
<div>
    <p>...</p>
    <span>...</span>
    <p>...</p>
    <p>...</p>
    <span>...</span>
    
    // 会匹配这个p，p的父级（div）的第4个相同子节点，会数第4个p，略过span
    <p>...</p>
    <p>...</p>
</div>
```
    
### :nth(-last)-child(2n)偶数、:nth(-last)-child(2n-1)奇数、:nth-of-type(2n)、:nth-of-type(2n-1)

```css
p:nth-child(2n) {
    ...
}
```

```html
<div>
    <p>...</p>
    <span>...</span> // 因为2*1是span，所以不选中
    <p>...</p>
    <p>...</p> // 1、会匹配这个 2*2
    <span>...</span>
    <p>...</p> // 2、会匹配这个 2*2
    <p>...</p>
</div>

// 其他几个同理

注：2n可以换成even、2n-1可以换成odd
```
    
### :only-of-type

元素的父元素，只能有唯一的该元素

```css
p:only-of-type {
    ...
}
```

```html
<div>
    <span>...</span>
    <p>...</p> // 匹配不了，p的父元素（div）有2个p元素
    <p>...</p>
</div>
<div>
    <span>...</span>
    <p>...</p> // 匹配，p的父元素（div）只有这么一个p元素
</div>
```
    
### :only-child 

元素的父元素，只能有唯一元素且为该元素

```css
p:only-child  {
    ...
}
```

```html
<div>
    <span>...</span>
    <p>...</p> // 匹配不了，p的父元素（div）里有2个子元素
</div>

<div>
    <p>...</p> // 匹配，p的父元素（div）里只有1个子元素，而且是p元素
</div>
```
    
### :empty

选择没有子节点的元素

```css
p:empty {
    ...
}
```

```html
<div>
    <p> p </p>
    <span> span </span>
    <p> p </p>
    <p> p </p>
    <span> span </span>
    <p> p </p>
    <p></p> // 会匹配这个p，因为它没有子节点
</div>

注：就算是空格、回车等，也算有子节点，所以<p> </p>（带空格）匹配不到
```
    
### :target

a标签href所对应的元素锚点。即被跳转的地方设置样式

```css
li:target {
    ...
}
```

```html
<a href='#item'>...</a>

<ul>
    <li>...</li>
    <li>...</li>
    <li>...</li>
    <li>...</li>
    <li>...</li>
    <li id='item'>...</li> // 匹配这个
</ul>
```
    
### :disabled、:enabled

```css
input:disabled {
    ...
}
input:enabled {
    ...
}
```

```css
// disabled选中这个
<input type='checkbox' name='ss' disabled />神羊

// enabled选中这个
<input type='checkbox' name='ss' />神鸡
```
    
### :checked

表示已经选中的表单控件（checkBox、radio）

```css
input:checked {
    ...
}
```

```html
// 选中这个
<input type='checkbox' name='ss' checked />神羊
```
    
### ::selection

鼠标选择了文字后生效

```css
p::selection {
    ...
}
```

```html
// 当鼠标选中里面的文本时生效
<p>...</p>
```
    
### :not(selector)
    
```css
// 选中id不等于item的li
li:not(#item) {
    ...
}
```
    
### E~F

表示E元素后的所有兄弟元素F
    
```css
p~div {
    ...
}
```

```html
<div>...</div> // 不匹配这个div，它在p前面
<p>...</p>
<div>...</div> // 匹配这个div
<div>...</div> // 匹配这个div
<span>...</span>
<div>...</div> // 匹配这个div
```

## pointer-events

`pointer-events` 是 CSS3 用于指定在什么情况下 (如果有) 元素可以成为鼠标事件的 target

如果了解 JavaScript，可以知道我们可以为 DOM 节点添加事件交互行为

```html
<div class='main' />
```

```css
.main {
    width: 100px;
    height: 100px;
    border: 1px solid skyblue;
}
```

```js
var main = document.querySelector('.main');
main.onclick = function() {
    console.log('click'); // 点击 div 元素，就可以在控制台看到输出
}
```

但有些场景中，我们可能希望变更元素的事件行为，如：

- 让一个已经绑定了 click 事件的元素，暂时失去这个事件能力

那么我们可以：

```css
.main {
    width: 100px;
    height: 100px;
    border: 1px solid skyblue;
    pointer-events: none; /* 禁止元素任何事件行为，这时再去点击就会发现事件无效了 */
}
```

值得注意的是：给元素添加 `pointer-events: none` 后，其全部子节点都会失去事件行为

```html
<div class='main'>
    <div class='child' />
</div>
```
```css
.main {
    width: 100px;
    height: 100px;
    border: 1px solid skyblue;
    pointer-events: none;
}

.child {
    width: 100px;
    height: 50px;
    border: 1px solid pink;
}
```

```js
var child = document.querySelector('.child');
child.onclick = function() {
    console.log('click'); // 会发现连 .child 节点的事件都触发不了了
}
```

解决方案是：

```css
.child {
    width: 100px;
    height: 50px;
    border: 1px solid pink;
    pointer-events: initial; /* 单独解放 .child 的事件行为 */
}
```

