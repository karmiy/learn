const salesOffices = {}; // 定义售楼处
salesOffices.clientList = []; // 缓存列表，存放订阅者的回调函数
salesOffices.listen = function(fn) { // 增加订阅者
    this.clientList.push(fn); // 订阅的消息添加进缓存列表
};
salesOffices.trigger = function(...args) { // 发布消息
    this.clientList.forEach(fn => fn(...args));
};

salesOffices.listen(function(price, squareMeter) { // A 订阅消息
    console.log('价格= ' + price);
    console.log('平方米= ' + squareMeter);
});

salesOffices.listen(function(price, squareMeter) { // B 订阅消息
    console.log('价格= ' + price);
    console.log('平方米= ' + squareMeter);
});

salesOffices.trigger(2000000, 88);
// A、B 都接收到消息：价格= 2000000 平方米= 88