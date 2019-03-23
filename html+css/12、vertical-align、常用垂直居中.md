## vertical-align

垂直对齐方式，只对**行内元素inline、inline-block**有效，默认基线对齐，主要用来**处理文字和图片的对齐方式**

![Alt text](./imgs/12-01.png)

**默认基线对齐：**
    
    #box{
        width: 600px;
        border: 4px solid darkorchid;
        margin:  50px auto;
    }
    #box .item {
        font-size: 40px;
    }
    
    <div id='box'>
        <span>行吧</span>
        <span class="item">可以的</span>
    </div>
    
![Alt text](./imgs/12-02.png)

**顶部对齐：**

    #box{
        width: 600px;
        border: 4px solid darkorchid;
        margin:  50px auto;
    }
    #box .item {
        vertical-align: top; // 设置top对齐
        font-size: 40px;
    }
    
    <div id='box'>
        <span>行吧</span>
        <span class="item">可以的</span>
    </div>
    
![Alt text](./imgs/12-03.png)

**底部对齐：**

    #box{
        width: 600px;
        border: 4px solid darkorchid;
        margin:  50px auto;
    }
    #box img {
        vertical-align: bottom; // 图片的bottom和文字的基线对齐
    }
    
    <div id='box'>
        <span>行吧</span>
        <img src="./1.png" alt="" />
    </div>

![Alt text](./imgs/12-04.png)

**数值：**

    #box{
        width: 600px;
        border: 4px solid darkorchid;
        margin:  50px auto;
    }
    #box img {
        vertical-align: -50px; // 设置-50px
    }
    
    <div id='box'>
        <span>行吧</span>
        <img src="./1.png" alt="" />
    </div>
    
![Alt text](./imgs/12-05.png)

> &#9733; 贴士 

**为什么经常会遇到元素设置width、height 100%，height却不能充满父级？**

    #box{
        width: 150px;
        border: 4px solid darkorchid;
        margin:  50px auto;
    }
    #box img {
        height: 100%;
    }
    <div id='box'>
        <img src="./1.png" alt="" />
    </div>
    
![Alt text](./imgs/12-06.png)

**原因：**
    
    #box{
        width: 200px;
        border: 4px solid darkorchid;
        margin:  50px auto;
    }
    #box img {
        height: 100%;
    }
    <div id='box'>
        文字
        <img src="./1.png" alt="" />
    </div>

![Alt text](./imgs/12-07.png)

（图片默认基线对齐，而文字的基线离底部略微有些距离，所以会参数空白）

**解决方式：**
    
    #box{
        width: 150px;
        border: 4px solid darkorchid;
        margin:  50px auto;
    }
    #box img {
        height: 100%;
        vertical-align: middle; // 设置垂直对齐方式为middle
    }
    <div id='box'>
        <img src="./1.png" alt="" />
    </div>
    
![Alt text](./imgs/12-08.png)

## 元素垂直居中方式

1、行高实现垂直居中

![Alt text](./imgs/12-09.png)

