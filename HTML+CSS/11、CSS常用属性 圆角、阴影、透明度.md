## 圆角属性border-radius

图例：

![Alt text](./imgs/11-01.png)

写法：
    
    // 4个值
    border-radius: 10px 10px 10px 10px; // 左上 右上 右下 右下
    
    // 2个值
    border-radius: 10px 10px // 左上右下  右上左下
     
    // 1个值
    border-radius: 10px // 4个角
    
    // 百分比
    border-radius: 50% // 4个角圆角
    
    // 8个值
    border-radius: 5p 10px 15px 20px/15px 20px 30px 50px; // x轴的上右下左 / y轴的上右下左
    
![Alt text](./imgs/11-02.png)

分解属性：

    border-top-left-radius
    border-top-right-radius
    border-bottom-right-radius
    border-bottom-left-radius
    
## 阴影box-shadow

图例：

![Alt text](./imgs/11-03.png)

写法：
    
    // 4个值：水平方向位移、垂直方向位移、阴影模糊程度、阴影颜色
    box-shadow: 0px 0px 5px blue;
    
    // 5个值：（如下图1）水平方向位移、垂直方向位移、阴影模糊程度、阴影扩散距离、阴影颜色
    box-shadow: 0px 0px 5px 10px blue;
    
    // 6个值：（如下图2）水平方向位移、垂直方向位移、阴影模糊程度、阴影扩散距离、阴影颜色 扩散方向
    box-shadow: 0px 0px 10px 0px blue inset;
    
![Alt text](./imgs/11-04.png)

![Alt text](./imgs/11-05.png)

## 透明度opacity、rgba、filter

### opacity

    <div id='box'>
        透明度
    </div>
    
    #box {
        opacity: .5  // 取值 0 - 1
    }
    
![Alt text](./imgs/11-06.png)
![Alt text](./imgs/11-07.png)

**注意：整个元素包括文字都受影响**

兼容性：>= IE9

### rgba

    <div id='box'>
        透明度
    </div>
    
    #box {
        background-color: rgba(135, 206, 235, .5)  // 取值 0 - 1
    }
    
![Alt text](./imgs/11-08.png)

**注意：只会影响背景**
兼容性：>= IE9

### filter

解决IE下不兼容的问题

    filter: alpha(opacity = 50) // 取值0 - 100
    
