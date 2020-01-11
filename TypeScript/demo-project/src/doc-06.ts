// 限定符
// public
class Animal_1 {
    name: string = 'animal';
    public eat() {
        console.log('eat');
    }
}
const animal_1 = new Animal_1();
animal_1.eat();

// private
class Animal_2 {
    name: string = 'animal';
    public eat() {
        console.log('eat');
        this.run(); // ok
    }
    private run() {
        console.log('run');
    }
}
const animal_2 = new Animal_2();
// animal_2.run(); // Error

// protected
class Animal_3 {
    name: string = 'animal';
    public eat() {
        console.log('eat');
        this.run();
    }
    private run() {
        console.log('run');
        this.sleep(); // ok
    }
    protected sleep() {
        console.log('sleep');
    }
}
class Cat_3 extends Animal_3 {
    init() {
        this.sleep(); // ok
    }
}
const animal_3 = new Animal_3();
// animal_3.sleep(); // Error
const cat_3 = new Cat_3();
// cat_3.sleep(); // Error

// 抽象类
abstract class Animal_4 {
    abstract name: string;
    abstract eat(food: string): void;
    move() {
        console.log('move...');
    }
}
// const animal_4 = new Animal_4();
class Cat_4 extends Animal_4 {
    name: string = 'cat';
    eat(food: string) {
        console.log('eat: ' + food);
    }
}

// 只读 readonly
class Animal_5 {
    readonly name: string = 'animal';
    public eat() {
        console.log('eat');
    }
}
const animal_5 = new Animal_5();
console.log(animal_5.name); // ok
// animal_5.name = 'k'; // Error

// 静态
class Animal_6 {
    static vName: string = 'animal';
    static eat() {
        console.log(Animal_6.vName);
    }
}
console.log(Animal_6.vName);
console.log(Animal_6.eat());

// 多态
class Animal_7 {
    eat() {

    }
}

class Cat_7 extends Animal_7 {
    eat() {
        console.log('Cat eat fish');
    }
}

class Dog_7 extends Animal_7 {
    eat() {
        console.log('Dog eat bones');
    }
}

// 类实现接口
interface Action {
    actionName: string;
    eat: (food: string) => void;
    move: () => string;
}
interface Play {
    playName: string;
}
class Animal_8 implements Action, Play {
    actionName: string = 'motion';
    playName: string = 'jump';
    eat(food: string) {
        console.log('eat: ' + food);
    }
    move() {
        return 'moving';
    }
}

// 接口继承类
class Animal_9 {
    name: string = 'animal';
    eat(food: string) {
        console.log('eat: ' + food);
    }
}
interface Ani extends Animal_9 {
    move: () => string;
}
const animal_9: Ani = {
    name: 'animal',
    eat(food: string) {
        console.log('eat: ' + food);
    },
    move() {
        return 'moving';
    }
}

// export {};