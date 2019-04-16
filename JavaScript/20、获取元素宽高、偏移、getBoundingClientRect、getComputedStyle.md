## 获取元素的宽高

兼容性: 在低版本IE可能存在误差

### clientWidth/clientHeight

    // 说明
    获取元素可视区域的宽高
    width + padding（不包括出现的滚动条占据的宽度，边框）
    只能获取，不能赋值，返回number数值
    
    console.log(wrap.clientWidth);
    
![Alt text](./imgs/20-01.png)

### offsetWidth/offsetHeight

    // 说明
    获取元素整体的实际宽高
    width + padding + border + 出现的滚动条占据的宽度
    只能获取，不能赋值，返回number数值
    
    console.log(wrap.offsetWidth);
    
![Alt text](./imgs/20-02.png)

### scrollWidth/scrollHeight

    // 说明
    获取元素内容的实际宽高
    没有滚动条时scrollWidth === clientWidth
    当元素内部过宽，出现滚动条时，scrollWidth是其实际内容的宽度
    只能获取，不能赋值，返回number数值
    
    console.log(wrap.scrollWidth);
    
![Alt text](./imgs/20-03.png)

### innerWidth/innerHeight

    // 说明
    获取窗口可视区域大小，是window的属性
    包括滚动条占据的宽度
    兼容性： > IE8
    只能获取，不能赋值，返回number数值
    
    console.log(window.innerWidth);

![Alt text](./imgs/20-06.png)

## 获取元素偏移

### scrollLeft/scrollTop
    
    // 说明
    获取元素的垂直滚动高度、水平滚动偏移
    可以获取和赋值，返回number数值
    
    console.log(wrap.scrollTop);
    
![Alt text](./imgs/20-04.png)

    // 获取浏览器滚动高度
    Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    
    // 页面滚动到400px的位置
    document.documentElement.scrollTop = document.body.scrollTop = 400;
    或
    window.scrollTop(0, 400);

### offsetLeft/offsetTop

    // 说明
    获取元素到定位父级的距离
    只能获取，不能赋值，返回number数值
    
![Alt text](./imgs/20-05.png)

    // 如何获取元素到body的距离
    function getOffset(dom) {
        var offset = {
            left: 0,
            top: 0,
        };
        while( dom !== document.body) {
            offset.top += dom.offsetTop;
            offset.left += dom.offsetLeft;
            dom = dom.offsetParent;
        }
        return offset;
    }
    
## getBoundingClientRect

    // 获取元素全方位宽高、偏移信息，返回一个对象
    // 兼容性：
        IE下返回的对象没有x、y这2个属性，可以用left、top替代
        >= IE9,包含width、height、top、right、bottom、left
        IE9 > X > IE6：包含top、right、bottom、left,缺少width、height
        
    // 示例
    console.log(wrap.getBoundingClientRect());
    
    // 返回结果
    {
        x: 574.5,
        y: 100,
        left: 574.5,
        top: 100,
        bottom: 300,
        right: 774.5,
        height: 200,
        width: 200,
    }
    
![Alt text](./imgs/20-07.png)

    // 应用场景
    非常多，大多与滚动有关的计算都会用到，如图片懒加载等
    
## 获取元素样式集合

### getComputedStyle

    // 说明
    获取元素样式的集合，返回一个对象
    兼容性： >= IE9
    
    // 示例
    console.log(getComputedStyle(wrap));
    console.log(getComputedStyle(wrap).borderTopWidth);
    
![Alt text](./imgs/20-08.png)

    // 注
    属性如宽度，设置百分比50%，获取也是获取到像素值，即最终都会转化为PX；
    颜色值获取的大多是rgb（根据浏览器），所以不要做对等判断
    
    // 配合
    取宽高那些会得到字符串如'500px'，可以配合parseFloat获取数值喔
    
### dom.currentStyle

    // 说明
    获取元素样式的集合，返回一个对象
    兼容性：全部IE，只有IE有效
    
    // 示例
    console.log(wrap.currentStyle)
    console.log(wrap.currentStyle.borderTopWidth)
    
![Alt text](./imgs/20-09.png)

### 兼容性polyfill

    window.getComputedStyle = 
        window.getComputedStyle || function(dom) {
        return dom.currentStyle;
    }