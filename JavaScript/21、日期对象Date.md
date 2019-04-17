## 日期Date对象

### 基本用法
    
    // 获取当前系统时间信息
    var d = new Date();
    console.log(d);
    
![Alt text](./imgs/21-01.png)

### 获取年月日时分秒周

    // 注
    获取的是number数字，不是string字符串
    
    var d = new Date();
    console.log(d.getFullYear()); // 2019
    console.log(d.getMonth()); // 3（从0计起）
    console.log(d.getDate()); // 16
    console.log(d.getHours()); // 23
    console.log(d.getMinutes()); // 50
    console.log(d.getSeconds()); // 0
    console.log(d.getDay()); // 2（周二，周天是0）
    