## let、const

ES6中使用let、const来替代我ES5的var

### let

    特性一：不存在变量提升
    console.log(a); // 报错，let定义的变量无法进行变量提升
    let a = 10;
    
    特性二：相同作用域下，不可重复定义
    let a = 10;
    var a = 20; // 报错
    
    特性三：暂时性死区(TDZ)
    
    使用var:
    var a = 10;
    function fn() {
        console.log(a); // undefined
        var a = 20;
    }
    fn();
    
    使用let
    let a = 10;
    function fn() {
        console.log(a); // 报错
        let a = 20;
    }
    fn();
    
    //注：
    只要块级作用域内存在let，它所声明的变量就绑定这个区域，不受外部影响。
    上面的代码，块级作用域fn内let又声明了a，导致a绑定了这个作用域，所以在let声明变量前输出a，就会报错

    // let其他应用
    for(var i = 0; i < 10; i++){
        setTimeout(function(){
            console.log(i); // 输出10个10，因为setTimeout是异步的，同步代码for都执行完后，i变成了10才会执行setTimeout
        });
    }
    
    for(let i = 0; i < 10; i++){
        setTimeout(function(){
            console.log(i); // 输出0-9，因为let是块级作用域，它的作用域在for里，每次for循环都生成各自作用域的i，所以可以输出0-9，而不是像var i，都是同一个i
        });
    }
    
    // 关于顶层对象
    ES5中：
    var a = 1;
    console.log(window.a); // 1，可以取到
    
    ES6中：
    let a = 1;
    console.log(window.a); // 报错，全局作用域下的let定义的变量也不绑定在window上
    
### const

    // 基本特性
    与let相同
    
    // 其他特性一：必须声明时赋值
    const a; // 报错，要立即赋值
    
    // 其他特性二：不能重复赋值
    const a = 1;
    a = 2; // 报错，不能重复赋值
    
    const b = [1];
    b.push(2); // 可以，同一个引用
    
    // const其他应用
    const fn = function(){...} // 可用于声明函数，因为函数只声明一次不会重复赋值
    
## 块级作用域

ES5里只有函数function是个作用域

ES6规定了以下块级作用域

    // 1、{}作用域
    {
        let i = 0;
    }
    console.log(i); // 报错，ES6里{}就是一个作用域
    
    {
        var i = 0;
    }
    console.log(i); // 0，可以访问到，ES5只有函数是个作用域
    
    // 2、if作用域
    if(true) {
        let x = 10;
    }
    console.log(x); // 报错，ES6里if也是一个作用域
    
    // 3、for作用域（ES6里for小括号都有一个独立作用域，然后大括号是它子作用域）
    示例一：
    for(let i = 0; i < 10; i++) {
        
    }
    console.log(i); // 报错
    
    示例二：
    for(let i = 0; i < 10; i++) { // for()这个小括号里也是一个独立的作用域
        let i = 0; // 不会报错，因为for()是个独立作用域，大括号{}里是它子作用域
        console.log(i);
    }
    
    示例三：
    for(let i = 0; i < 10; i++) {
        console.log(i);
         for(let i = 0; i < 10; i++) {
            console.log(i);
        }
    }
    // 不会报错，这里有4个作用域，从父到子为：第一个for()作用域，第一个for{}作用域，第二个for()作用域，第二个for{}作用域

    示例四:
    function fn(x) {
        let x = 10;
        console.log(x); // 报错，Identifier 'x' has already been declared
    }
    fn(1);
    // 注：
    函数如
    function fn() {}，小括号并没有和for一样，有自己的作用域，而是和{}同一个作用域