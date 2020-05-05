const event = {
    observers: [],
    addObserver(key, fn) {
        if (!this.observers[key]) this.observers[key] = [];

        this.observers[key].push(fn); // 订阅的消息添加进缓存列表
    },
    notify(key, ...args) {
        const fns = this.observers[key];
        if (!fns || fns.length === 0) return false;

        fns.forEach(fn => fn(...args));
    },
    removeObserver(key, fn) {
        const fns = this.observers[key];
        if(!fns || fns.length === 0) return false;
        
        if(!fn) {
            fns && (fns.length = 0); // 如果没有传具体回调，取消 key 对应的所有订阅
        } else {
            for(let l = fns.length - 1; l >=0; l--) {
                const _fn = fns[l];
                if(_fn === fn) fns.splice(l, 1);
            }
        }
    }
};

// 定义安装函数，让对象动态安装观察者功能
const installEvent = function(obj) {
    for (let key in event) {
        obj[key] = event[key];
    }
};


const salesOffices = {};
installEvent(salesOffices);

const fn_a = function(price) {
    console.log('A: 价格= ' + price);
}
salesOffices.addObserver('squareMeter88', fn_a);
salesOffices.notify('squareMeter88', 2000000); // 输出: A: 价格= 2000000

salesOffices.removeObserver('squareMeter88', fn_a);
salesOffices.notify('squareMeter88', 2000000); // 取消了订阅，无输出