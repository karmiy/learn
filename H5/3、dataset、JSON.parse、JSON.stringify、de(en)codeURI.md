## dataset

H5提供了DOMStringMap对象，让我们可以在DOM上设置data-开头的自定义属性

    // 基本示例
    <div id='box' data-k='自定义属性'></div>
    
    const box = document.getElementById('box');
    console.log(box.dataset);
    
![Alt text](./imgs/03-01.png)

    // 增
    box.dataset.aBC = '增加的属性'
    
    <div id='box' data-k='自定义属性' data-a-b-c='增加的属性'></div>
    
    // 删
    box.dataset.aBC = ''
    
    <div id='box' data-k='自定义属性' data-a-b-c></div>
    
    // 改
    box.dataset.k = '修改的k'
    
    <div id='box' data-k='修改的k' data-a-b-c></div>
    
    // 查
    console.log(box.dataset.k); // '修改的k' 
    
## JSON.parse、JSON.stringify

JSON.parse 字符串转对象

    const str = '{"name": "karmiy"}'; // 属性名需要严格加上双引号
    console.log(JSON.parse(str)); // {name: "karmiy"}
    
JSON.stringify 对象转字符串

    const arr = ['karmiy', 18];
    console.log(JSON.stringify(arr)); // '["karmiy",18]'
    
    
    // 应用场景
    常用于深拷贝对象
    const arr = [1, [2, 3]];
    const _arr = JSON.parse(JSON.stringify(arr));
    console.log(_arr); // [1, [2, 3]]
    console.log(_arr === arr); // false
    console.log(_arr[1] === arr[1]); // false
    
## decodeURI、encodeURI

decodeURI(Component)对编码后的URI进行解码

    const str = 'https://www.baidu.com/s?wd=%E5%89%8D%E7%AB%AF';
    const _str = decodeURI(str);
    console.log(_str); // 'https://www.baidu.com/s?wd=前端'
    
encodeURI(Component)将字符串作为URI进行编码

    const str = 'https://www.baidu.com/s?wd=前端';
    const _str = encodeURI(str);
    console.log(_str); // 'https://www.baidu.com/s?wd=%E5%89%8D%E7%AB%AF'
    
    有没有带Component的差别：
    含有Component能编译的字符更多，像; / ? : @ & = + $ , #符号在会被encodeURIComponent编码
    通常完整的url不适合用带Component的去编码，如encodeURIComponent('https://www.baidu.com/s?wd=前端')会生成如下
    'https%3A%2F%2Fwww.baidu.com%2Fs%3Fwd%3D%E5%89%8D%E7%AB%AF'，连://都被编码了
    
## btoa、atob

说明：base64编码（解码）字符串

用途：这种字符串的好处在于减少http请求，在项目中，一些小图片就会base64编码来减少请求，但是不要大面积使用，会导致文件体积过大

组成：0-9 a-z A-Z + / = 64个字符

    // 1、btoa base64编码字符串
    const str = 'karmiy';
    const _str = window.btoa(str);
    console.log(_str); // 'a2FybWl5'
    
    // 2、atob 解码
    const str = 'a2FybWl5';
    const _str = window.atob(str);
    console.log(_str); // 'karmiy'
    
    // 3、中文处理
    const str = '名称为karmiy';
    const _str = window.btoa(encodeURIComponent(str));
    console.log(_str); // 'JUU1JTkwJThEJUU3JUE3JUIwJUU0JUI4JUJBa2FybWl5'
    const $str = window.atob(_str);
    console.log(decodeURIComponent($str)); // '名称为karmiy'
    
    
