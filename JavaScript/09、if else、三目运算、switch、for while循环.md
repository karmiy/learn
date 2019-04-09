## if else
    
    // if、 else
    if(a > 1) {
        ...
    }else {
        ...
    }
    
    // if、 else if、else
    if(a > 1) {
        ...
    }else if {
        ...
    }else if {
        ...
    }else {
        ...
    }
    
    // 注
    除了undefined、null、NaN、false、0、''以外，对if判断来说都是false
    
## 三目运算

    // if else语句
    if( a < b ){
        console.log(a);
    }else {
        console.log(b);
    }
    
    // 改写为三目运算
    a < b ? console.log(a) : console.log(b);
    
    // 多语句
    a < b ? (
        console.log(1),
        console.log(2),
        console.log(3)
    ) : (
        console.log(4),
        console.log(5),
        console.log(6)
    )
    
## switch

    var name = 'a';
    switch(name) {
        case 'a':
            console.log(1);
            break; // 要break否则会继续往下执行
        case 'b':
            console.log(2);
            break;
        case 'c':
            case 'd':    // 同时2个case相当于或
            console.log(3);
            break;
        default: // 都不满足走default
            console.log(4); 
            break;
    }
    
    // 注
    case都是全等 === 判断
    
## for循环
    
    // 示例一
    for(var i = 0; i < 10; i++) {
        console.log(i);
    }
    
    // 示例二
    var i = 0;
    for(; i < 10;) {
        console.log(i);
        i++;
    }
    
    // break
    for(var i = 0; i < 10; i++) {
        if(i === 5) {
            break; // 等于5时跳出循环不再执行
        }
        console.log(i);
    }
    
    // continue
    for(var i = 0; i < 10; i++) {
        if(i === 5) {
            continue; // 等于5时跳出当前循环，不往下执行本次循环剩余代码，直接走i++
        }
        console.log(i);
    }
    
## while
    
    // while示例
    var i = 0;
    while(i < 8) {
        ...
        i++;
    }
    
    // do while示例（先走do，再走while里判断）
    var i = 20;  
    do {
        console.log(i);
        i--;
    }while(i > 10)
    // 输出 20 -> 11
    