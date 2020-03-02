## JS 获取元素的几种方式

我们将获取元素的方式划分为动态获取和静态获取

### 动态获取方式
    
    // 通过id获取某一个元素
    // 兼容性：全浏览器兼容
    1、document.getElementById('wrapper')  
    
    // 通过class类名获取元素，是类数组
    // 兼容性： > IE8
    2、document.getElementsByClassName('container')
    
    // 通过标签名获取元素，是类数组
    // 兼容性： 全浏览器兼容
    3、document.getElementsByTagName('div')
    
    // 通过name获取元素，是类数组
    // 兼容性：全浏览器兼容
    4、document.getElementsByName()
    
    // 注
    除了getElementById()，前面都不一定要document，可以是某个元素，如下：
    var app = document.getElementById('app');
    app.getElementsByClassName('container');
    
### 静态获取方式
    
    // 兼容性： >= IE8
    // 以CSS选择器查找元素，如果有多个匹配元素，取第一个
    1、document.querySelector('#app .container')
    
    // 以CSS选择器查找元素，是个类数组
    2、document.querySelectorAll('#app .container')
    
    // 优点
    非常强势，可以使用CSS选择器查找元素，有jQuery查找元素的效果和相对其更好的性能
    // 缺点
    在原生api中，性能不好，和前面 getElementByXXX 的方法性能差几十倍
    
    // 注
    前面也可以不用document，使用其他元素，但是不推荐这么做，会有机制问题

### 动态获取与静态获取

动态获取指的是，每次使用都会再去获取，即使最开始没有，后来添加了，也能获取到

    // 示例
    <div>
        <p class='k'></p>
    </div>
    页面上类名为k的当前只有一个p元素
    
    var lst = document.getElementsByClassName('k')
    lst是类数组，只有1个元素
    console.log(lst.length) 会打印出1
    
    当我们向div再append一个p.k后，变成
    <div>
        <p class='k'></p>
        <p class='k'></p>
    </div>
    
    这时我们再次打印
    console.log(lst.length) 会打印出2
    这就是动态获取，不需要重新调用getElementsByClassName，就可以动态的获取到新结果
    
    
## JS获取顶层标签HTML、body、head、title标签

    // 获取这些dom不需要使用上述方法
    
    // HTML
    document.documentElement
    
    // body
    document.body
    
    // head
    document.head
    
    // title
    document.title
    
## JS事件分类

    // 鼠标事件
    onclick 左键点击
    ondblclick 左键双击
    onmouseover、onmouseenter 鼠标移入（区别：绑定over的元素，鼠标移入该元素及其子元素都会触发，enter只会在鼠标移入该元素时触发）
    onmouseout、onmouseleave 鼠标移除（区别同上，over对应out，enter对应leave）
    onmousedown 鼠标按下
    onmouseup 鼠标抬起
    oncontextmenu 右键单击
    onmousewheel 鼠标滚轮滚动
    
    // 键盘事件
    onkeydown、onkeypress 键按下（区别：down是用户按下任何键盘键时触发，presss是用户按下并放开时触发，比down晚，并且系统键如Esc,Shift,Ctrl不触发）
    onkeyup 键抬起（与down相反）
    
    // 系统事件
    onload 文档加载完成后
    onerror 加载出错后
    onresize 窗口调整大小时
    onscroll 滚动时
    
    // 表单事件
    onfocus 获取焦点后
    onblur 失去焦点后
    onchange 改变内容后
    oninput 尝试输入时
    onreset 重置后
    onselect 选择后
    onsubmit 提交时
    