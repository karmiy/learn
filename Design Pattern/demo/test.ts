namespace Test {
    abstract class Beverage {
        boilWater(): void {
            console.log('把水煮沸');
        }
        abstract brew(): void;
        abstract pourInCup(): void;
        abstract addCondiments(): void;

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
}