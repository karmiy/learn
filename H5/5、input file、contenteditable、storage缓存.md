## input file扩展

### accept属性

用来指定浏览器接受的文件类型，打开系统的选择文件弹框的时候，默认界面中呈现的文件类型

accept="image/png"，界面中只限定呈现png图片

accept="image/*"，界面中呈现所有图片，谷歌尽量避免/*，会有卡顿

accept="image/png, image/jpeg"，界面中呈现png和jpg图片

accept="video/*"，界面中呈现视频

accept="audio/*"，界面中呈现音频

accept="text/css"，界面中呈现.css

... (更多MIME 类型列表可网上了解)
    
    // 指定选择.png
    <input id='file' type='file' accept="directory">

![Alt text](./imgs/05-01.png)

    // 指定文件夹
    <input id='file' type='file' webkitdirectory>
    
![Alt text](./imgs/05-02.png)

### capture属性

    适用于移动端开发的：摄像、录音、录像
    
    // 摄像
    <input id='file' type='file' capture="camera">
    
    // 录音
    <input id='file' type='file' capture="microphone">
        
    // 录像
    <input id='file' type='file' capture="camcorder">

## contenteditable可编辑

H5可以对元素添加contenteditable属性使其可编辑
    
    <div id="wrap" contenteditable="true"></div>
    
![Alt text](./imgs/05-03.png)

## 本地存储Storage

### localStorage、sessionStorage

![Alt text](./imgs/05-04.png)

(兼容性 >= IE8，localStorage是永久存储，关闭浏览器也在；sessionStorage是临时存储，浏览器关闭后消失)

### 操作方式

    // 1、存值setItem
    window.localStorage.setItem('login', 'karmiy');
    或
    window.localStorage.login = 'karmiy';
    
        注：value需要是字符串
    
![Alt text](./imgs/05-05.png)
    
    // 2、取值getItem
    console.log(window.localStorage.getItem('login'));
    或
    console.log(window.localStorage.login);
    
    // 3、删除removeItem
    window.localStorage.removeItem('login');
    
    // 4、清空clear
    window.localStorage.clear();
    
### Web Storage与Cookie

    // 1、传递
    cookie在浏览器与服务器间来回传递
    storage不会把数据发送服务器，仅本地保存

    // 2、有效期
    cookie在过期时间前一直有效，即使窗口或浏览器关闭
    sessionStorage在存储数据脚本所在的最顶层窗口（即某个iframe中执行存储sessionStorage操作的情况下，它最顶层的窗口关闭则失效）或浏览器标签关闭时失效
    localStorage永久有效
    
    // 3、存储大小
    cookie不能超过4K
    storage也有大小限制，但可以达到5M或更大
    
    // 4、作用域不同
    cookie在所有同源(URL的协议、端口、主机名三者中有一个不同，就属于不同的文档源)窗口共享
    localStorage在所有同源窗口共享
    sessionStorage不仅需要同源，且需要窗口是顶层页面打开的，如www.a/1.html，超链接打开www.a/2.html这样的2.html才能与1.html共享，直接URL打开www.a/2.html
    则无法共享
    

    
    


    