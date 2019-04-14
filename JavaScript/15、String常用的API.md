## String常用的API

String的API一般都不会改变原字符串，所以通常需要用个变量存储结果

    var s = '123abc';
    var arr = s.split('');
   
    console.log(s); // '123abc'（不会改变原字符串）
    console.log(arr); // ['1', '2', '3', 'a', 'b', 'c']
    
### 字符串字面量

    var k = new String('k');
    var k = String('k');
    var k = 'k'; // 这种方式便是常说的字面量
    
### length
    
    // 说明
    获取字符串长度
    
    // 示例
    console.log('karmiy'.length); // 6
    console.log('嗯嗯'.length); // 2（length不分单双字节，中文双字节、英文单字节）
    
### chatAt

    // 说明
    获取第X个字符，为了兼容低版本IE
    
    // 示例
    var s = 'karmiy';
    console.log(s[0]); // 'k'
    
    但是下标取字符在低版本IE不兼容，要使用chatAt
    console.log(s.chatAt(0)); // 'k'
    
    // 注
    字符串不能像数组一样，s[0] = 'm'来赋值
    
### charCodeAt、String.fromCharCode

    // 说明
    charCodeAt 获得Unicode码
    String.fromCharCode 通过Unicode码获得字符
    
    // 示例
    var s = 'karmiy';
    console.log(s.charCodeAt(0)); // 107
    
    console.log(String.fromCharCode(107)); // 'k'
    
    // 应用场景，通常用于加密
    var s = 'karmiy', newS = '';
    
    for(var i=0,len = s.length; i<len; i++) {
        newS += String.fromCharCode(s.charCodeAt(i) + 500);
    }
    console.log(newS); // ɟɕɦɡɝɭ
    
### substring、substr、slice

    // 说明
    都是切割字符串
    
    // 1、substring
    // 参数说明：起始序号（包含），终止序号（不包含）
    
    // 示例
    var s = 'karmiy';
    console.log(s.substring(0, 2)); // 'ka'，第0到第2位'kar'，第2位不包含，所以为'ka'
    console.log(s.substring(1)); // 'armiy',没有参数二，表示切割到最后
    console.log(s.substring(2, 0)); // 'ka',倒序相当于正序(0,2)
    console.log(s.substring(-3, 2)); // 'ka',参数一为负数相当于0
    console.log(s.substring(2, -1)); // 'ka',参数二为负数相当于0，即(2, 0)，又等于(0, 2)，所以是'ka'
    console.log(s.substring(-2, -1)); // '',参数负数相当于0，即(0, 0)，所以是''
    console.log(s.substring()); // 'karmiy',什么都不传，返回原字符串
    
    // 总结
    没有第二个参数，则切割到最后；
    两个参数大小相反，如substring(4,2)，则相当于(2,4)；
    参数有负数，则相当于参数0；
    没有参数返回原字符串；
    
    
    // 2、substr
    // 参数说明：起始序号，切割几位
    
    // 示例
    var s = 'karmiy';
    console.log(s.substr(1, 2)); // 'ar'，从第1位开始，切割2位
    console.log(s.substr(1)); // 'armiy'，没有参数二，表示切割到最后
    console.log(s.substr(-4, 3)); // 'rmi'，参数一为负数，相当于(s.length - 4, 3)，即(2, 3)
    console.log(s.substr(3, -2)); // ''，参数一为负数相当于0，即(3, 0)
    console.log(s.substr()); // 'karmiy',什么都不传，返回原字符串
    
    // 总结
    没有第二个参数，则切割到最后；
    参数一为负数，如substr(-3, 1)相当于(s.length-3, 1)
    参数二为负数，相当于0
    没有参数返回原字符串；
    
    
    // 3、slice
    // 参数说明：与substring一样，只是一些细节不同
    
    // 示例
    var s = 'karmiy';
    console.log(s.slice(0, 2)); // 'ka'，第0到第2位'kar'，第2位不包含
    console.log(s.slice(2, 0)); // ''，无法像substring倒序可以自动转正序
    console.log(s.slice(-5, 3)); // 'ar'，参数一为负数，相当于(s.length-5, 3)，即(1, 3)
    console.log(s.slice(1, -2)); // 'arm'，参数二为负数，相当于(1, s.length-2)，即(1, 4)
    console.log(s.slice()); // 'karmiy',什么都不传，返回原字符串
    
    // 总结
    没有第二个参数，则切割到最后；
    参数为负数，相当于s.length-x，如(-3, -2)相当于(s.length - 3, s.length -2)
    两个参数大小相反，返回空字符串''
    没有参数返回原字符串；
    
    // 应用场景（利用负数参数的特性）
    1、去除字符串的最后一位：
    
    不好的做法：
    s.substring(0, s.length - 1); // 还多调用一次length
    更好的做法：
    s.slice(0, -1);
    
    2、获取字符串最后一位：
    
    不好的做法：
    s.substring(s.length - 1); // 还多调用一次length
    更好的做法：
    s.slice(-1);
    s.substr(-1)
    
### to(Locale)LowerCase、to(Locale)UpperCase

    // 说明
    to(Locale)LowerCase 转换成小写
    to(Locale)UpperCase 转换成大写
    
    有Locale支持更多字符
    
    // 示例
    var s = 'KARMIY';
    console.log(s.toLocaleLowerCase()); // 'karmiy'
    var s = 'karmiy';
    console.log(s.toLocaleUpperCase()); // 'KARMIY'
    
### split

    // 说明
    切割字符串转数组
    
    // 示例
    var s = 'karmiy';
    console.log(s.split()); // ['karmiy'];
    
    var s = 'karmiy';
    console.log(s.split('')); // ['k', 'a', 'r', 'm', 'i', 'y'];
    
    var s = '|k|a|r|m|i|y';
    console.log(s.split('|')); // ['', 'k', 'a', 'r', 'm', 'i', 'y'];
    
    var s = 'karmiy';
    s.split(/ar/); // ['k', 'miy'] 可以是正则
    
### indexOf

    // 说明
    查找某个字符或字符串的位置
        
    // 示例
    var s = 'karmiy';
    console.log(s.indexOf('rm')); // 2，'rm'在s的第2位
    console.log(s.indexOf('n')); // -1，找不到返回-1
    console.log(s.indexOf('a', 2)); // -1，从第2位开始找，所以找不到，返回-1
    
### trim

    // 说明
    去除前后空格，>=IE8
    
    // 示例
    var s = ' karmiy ';
    console.log(s.trim()); // 'karmiy'
    



