## 如何实现水平居中

行内元素：

``````````
.wrap {
    text-align: center;
}
``````````

块级元素：

``````````
// 方式一: margin
.wrap {
    margin: 0 auto;
}

// 方式二：flex
.wrap {
    display: flex;
    justify-content: center;
}

// 方式三：absolute + left + margin-left
.wrap {
    position: absolute;
    width: 200px;
    left: 50%;
    margin-left: -100px;
}

// 方式四：absolute + left + transform
.wrap {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
}

// 方式五：absolute + left + right + margin
.wrap {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
}
``````````

## 如何实现垂直居中

行内元素：

``````````
// 方式一：行高
.wrap {
    height: 20px;
    line-height: 20px;
}

.wrap span {
    vertical-align: middle;
}

// 方式二：伪类
.wrap {
    width: 200px;
    height: 200px;
    border: 1px solid pink;
}

.wrap span {
    vertical-align: middle;
}

.wrap:after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 1px;
    height: 100%;
    background-color: transparent;
}
``````````

块级元素：

``````````
// 方式一：absolute + top + bottom + margin
.wrap {
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid red;
}

.wrap p {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    background-color: tomato;
}

// 方式二：absolute + top + margin-top
.wrap {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid pink;
}

.wrap p {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 50%;
    margin-top: -50px;
    background-color: red;
}

// 方式三：absolute + top + transform
.wrap {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid pink;
}

.wrap p {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 50%;
    transform: translateY(-50%);
    background-color: red;
}

// 方式四：flex
.wrap {
    display: flex;
    align-items: center;
}

// 方式五：table
<div class='wrap'>
    <div class='content'>
        123
    </div>
</div>

.wrap {
    display: table;
    width: 200px;
    height: 200px;
    border: 1px solid red;
}
.content {
    display: table-cell;
    vertical-align: middle;
}
``````````