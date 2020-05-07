class Beverage {
    boilWater() {
        console.log('把水煮沸');
    }
    brew() { } // 空方法，由子类重写
    pourInCup() { } // 空方法，由子类重写
    addCondiments() { } // 空方法，由子类重写
    init() {
        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();
    }
}

class Coffee extends Beverage {
    brew() {
        console.log('用沸水冲泡咖啡');
    }
    pourInCup() {
        console.log('把咖啡倒进杯子');
    }
    addCondiments() {
        console.log('加糖和牛奶');
    }
}

const coffee = new Coffee();
coffee.init();

class Tea extends Beverage {
    brew() {
        console.log('用沸水浸泡茶叶');
    }
    pourInCup() {
        console.log('把茶倒进杯子');
    }
    addCondiments() {
        console.log('加柠檬');
    }
}

const tea = new Tea();
tea.init();