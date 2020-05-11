const Beverage = function(param) {
    const boilWater = function() {
        console.log('把水煮沸');
    }
    const brew = param.brew || function() {
        throw new Error('必须传递 brew 方法');
    };
    const pourInCup = param.pourInCup || function() {
        throw new Error('必须传递 pourInCup 方法');
    };
    const addCondiments = param.addCondiments || function() {
        throw new Error('必须传递 addCondiments 方法');
    };
    const F = function() { };
    F.prototype.init = function() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };
    return F;
}

const Coffee = Beverage({
    brew: function() {
        console.log('用沸水冲泡咖啡');
    },
    pourInCup: function() {
        console.log('把咖啡倒进杯子');
    },
    addCondiments: function() {
        console.log('加糖和牛奶');
    }
});

const coffee = new Coffee();
coffee.init();