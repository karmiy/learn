namespace doc_08 {
    function add<T>(x: T): T {
        return x;
    }
    const add_2 = <T>(x: T): T => x;
    add<number>(1);
    add<string>('a');

    // 多个类型
    function swap<T, U>(tuple: [T, U]): [U, T] {
        return [tuple[1], tuple[0]];
    }
    swap([1, 'a']);

    // 泛型变量
    function logArrayLength<T>(arr: Array<T>): Array<T> {
        console.log(arr.length);
        return arr;
    }
    logArrayLength([1, 2, 3]);

    // 泛型接口
    interface ReturnItem_1<T> {
        (item: T): T;
    }
    interface ReturnItem_2 {
        <T>(item: T): T;
    }
    const returnItem: ReturnItem_1<number> = item => item;

    returnItem(1);

    const returnItem_2: ReturnItem_2 = <T>(item: T): T => item;

    // 泛型类
    class Stack<T> {
        private arr: T[] = []

        public push(item: T) {
            this.arr.push(item)
        }

        public pop() {
            this.arr.pop()
        }
    }

    const stack = new Stack<number>();
    stack.push(1);

    // 泛型约束
    class Stack_2<T extends number | string> {
        private arr: T[] = []

        public push(item: T) {
            this.arr.push(item)
        }

        public pop() {
            this.arr.pop()
        }
    }
    const stack_2 = new Stack_2<number>();

    interface Lengthwise {
        length: number;
    }

    function logLength<T extends Lengthwise>(arr: T): T {
        console.log(arr.length);
        return arr;
    }
    logLength({
        0: 'a',
        1: 'b',
        length: 2,
    });

    // 泛型约束与索引类型
    function getObjectValue<T extends object, U extends keyof T>(obj: T, key: U) {
        return obj[key];
    }

    getObjectValue({ id: 1, name: 'karmiy' }, 'id');

    // 多重类型进行泛型约束
    interface A {
        doForA(): number;
    }
    interface B {
        doForB(): number;
    }

    interface C extends A, B { }

    class Animal<T extends C> {
        loop(item: T) {
            item.doForA();
            item.doForB();
        }
    }
    const animal = new Animal();
    animal.loop({
        doForA: () => 123,
        doForB: () => 123,
    });
    /* animal.loop({
        doForA: () => 123,
        doForB: () => 123,
        a: 123,
    }); */

    // 泛型与 new
    function factory<T>(constructor: new () => T): T {
        return new constructor();
    }

    class Person {
        name: string = 'k';
    }
    const person = factory(Person);
    console.log(person.name);

    // 泛型参数默认类型
    function createArr<T = string>(value: T, length: number): Array<T> {
        let arr: T[] = [];
        for (let i = 0; i < length; i++) {
            arr.push(value);
        }
        return arr;
    }
}
// export {};