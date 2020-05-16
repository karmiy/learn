## transition过渡

JS控制样式、hover样式变化时，如从width: 100px 变为 width: 200px，可以使用transition实现动画过渡

### transition-duration过渡时间
    
```css
div {
    width: 100px;
    ...
    transition-duration: 3s; // 鼠标hover后，会以3s的动画时间从width 100变为200
}
div:hover {
    width: 200px;
}
```
    
### transition-property过渡属性名称

```css
div {
    width: 100px;
    height: 100px;
    ...
    transition-property: width; // 只有width才过渡，height不过渡
    transition-duration: 3s;
}
div:hover {
    width: 200px;
    height: 200px;
}

div {
    transition-property: width,height; // 可以设置多个值
}
```

### transition-delay延迟时间

```css
div {
    width: 100px;
    height: 100px;
    ...
    transition-delay: 2s; // 延迟2s才width才开始变换
    transition-property: width;
    transition-duration: 3s;
}
div:hover {
    width: 200px;
    height: 200px;
}
```
    
### transition-timing-function运行形势

```css
div {
    width: 100px;
    height: 100px;
    ...
    transition-delay: 2s;
    transition-property: width;
    transition-duration: 3s;
    transition-timing-function: cubic-bezier(.6, 1.5, .12, -0.41); // 走势是贝塞尔曲线
}
div:hover {
    width: 200px;
    height: 200px;
}
```

```js
取值：

1、linear 匀速
2、ease 慢快慢（默认）
3、ease-in 慢入
4、ease-out 慢出
5、ease-in-out 慢入慢出
6、cubic-bezier(x1, x2, x2, y2) 贝塞尔曲线
    x1 起点在x轴的坐标，取值0-1
    y1 起点在y轴的坐标，取值不限
    x2 终点在x轴的坐标，取值0-1
    y2 终点在y轴的坐标，取值不限
```

```css
div {
    width: 100px;
    height: 100px;
    ...
    transition-delay: 2s;
    transition-property: width, height;
    transition-duration: 3s;
    transition-timing-function: ease, linear; // 对应多个属性
}
div:hover {
    width: 200px;
    height: 200px;
}
```
    
### 复合写法

```js
// transition: 名称 时间 延迟时间 运行形势
```

```css
div {
    transition: width 3s 3s linear;
}

div {
    transition: width 3s 3s linear, height 2s 3s ease-in; // 多个值
}
```
    
## animation动画

### animation-name动画名称

```css
div {
    animation-name: run; // 动画名，对应@keyframes的名称
}

@keyframes run {
    0% { maring-left: 0; }
    25% { maring-left: 250px; }
    50% { maring-left: 500px; }
    75% { maring-left: 250px; }
    100% { maring-left: 0; }
}
```
    
### animation-duration 动画执行时间

```css
div {
    animation-name: run;
    animation-duration: 2s; // 一遍动画的执行时间是2s
}
```
    
### animation-delay动画延迟时间

```css
div {
    animation-name: run;
    animation-duration: 2s;
    animation-delay: 3s; // 延迟3秒后开始播放动画
}
```
    
### animation-timing-function 动画速度曲线

```css
div {
    animation-name: run;
    animation-duration: 2s;
    animation-delay: 3s;
    animation-timing-function: linear; // 动画匀速播放
}
```

```js
取值：
1、linear 匀速
2、ease 慢快慢（默认）
3、ease-in 慢入
4、ease-out 慢出
5、ease-in-out 慢入慢出
6、cubic-bezier(x1, x2, x2, y2) 贝塞尔曲线
    x1 起点在x轴的坐标，取值0-1
    y1 起点在y轴的坐标，取值不限
    x2 终点在x轴的坐标，取值0-1
    y2 终点在y轴的坐标，取值不限
```
        
### animation-iteration-count动画执行循环次数

```css
div {
    animation-name: run;
    animation-duration: 2s;
    animation-delay: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite; // 无限循环播放
}
```

```js
取值：
1、infinite 无限循环
2、默认1（播放1次就停止了）
3、自定义数值
```
    
### animation-direction动画运动方向

```css
div {
    animation-name: run;
    animation-duration: 2s;
    animation-delay: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: reverse; // 反向运动
}
```

```js
取值：
1、normal 默认，正常方向
2、reverse 反向运动
3、alternate 动画先正向再反向
4、alternate-reverse 动画先反向再正向
```
    
### animation-play-state动画执行状态

```css
div {
    animation-name: run;
    animation-duration: 2s;
    animation-delay: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: reverse;
}
div:hover {
    animation-play-state: paused; // 鼠标hover后动画暂停
}
```

```js
取值：
1、running 运动（默认）
2、paused 暂停
```
    
### animation-fill-mode动画对象时间之外的状态

```js
取值：
1、none（默认）  原始状态 -> 动画 -> 原始状态
2、forwards  原始状态 -> 动画 -> 停在动画帧100%
3、backwards  进入动画帧0%（忽略原始状态） -> 动画 -> 原始状态
4、both  进入动画帧0%（忽略原始状态） -> 动画 -> 停在动画帧100%
```

```css
------ none：------
@keyframes run {
    0% { maring-left: 0; }
    25% { maring-left: 250px; }
    50% { maring-left: 500px; }
    75% { maring-left: 250px; }
    100% { maring-left: 0; }
}
div {
    ...
    
    // 原始状态是 -50px，动画帧0%和100%却是0，会取原始状态，忽略动画帧的0%和100%
    margin-left: -50px;
    animation-name: run;
}
// margin-left变化： -50px -> 250px -> 500px -> 250px -> -50px
```
    
```css
------ forwards：------
div {
    ...
    margin-left: -50px;
    animation-name: run;
    // forward使动画结束后保值在动画帧100%，即margin-left:0，而不是原始-50px
    animation-fill-mode: forwards;
}
// margin-left变化： -50px -> 250px -> 500px -> 250px -> 0
```

```css
------ backwards：------
    
div {
    ...
    margin-left: -50px;
    animation-name: run;
    // backwards使动画起步时忽略原始的-50px，一开始在动画帧0%，即margin-left:0，动画完成再回到原始-50px
    animation-fill-mode: backwards;
}
// margin-left变化： 0 -> 250px -> 500px -> 250px -> -50px
```

```css
------ both：------

div {
    ...
    margin-left: -50px;
    animation-name: run;
    // both使动画起步时忽略原始的-50px，一开始在动画帧0%，即margin-left:0，动画完成后又忽略原始-50px，停在动画帧100%，即margin-left:0
    animation-fill-mode: both;
}
// margin-left变化： 0 -> 250px -> 500px -> 250px -> 0
```