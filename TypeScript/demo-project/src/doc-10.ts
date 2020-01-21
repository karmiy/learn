namespace doc_10 {
    // 结构类型
    interface Animal {
        name: string;
        age: number;
    }

    let ani:Animal = {
        name: 'blackWhite',
        age: 4,
    };
    const obj = {
        name: 'pink',
        age: 5,
        type: 'cat',
    }
    ani = Object.create({
        name: 'pink',
        age: 5,
        type: 'cat',
    });

    class Cat {
        name: string = 'blackWhite';
        age: number = 4;
        id: number = 1;
    }
    const animal: Animal = new Cat();

    // 函数传参兼容
    interface User {
        id: number;
        name: string;
    }
    function Log(r: User) {

    }
    const user = {
        id: 1,
        name: 'karmiy',
        code: 1,
    };
    Log(user);

    // 函数类型兼容性
    // 参数类型兼容性
    declare let b1:{name: string};
    declare let b2:void;
    // b2 = b1;
    // b1 = b2;

    let v1 = (a:number, b:string) => 10;
    let v2 = (a:number | string, b:string) => 100;
    v1 = v2; // ok
    // v2 = v1; 
    

    // 可选参数
    let u = (a:number, b?:string) => 1;
    let v = (a:number) => 0;
    v = u;
    u = v;

    // 参数类型一致，返回值类型兼容
    let o = (a:number) => {({id: 1})};
    let p = (a:number) => ({id: 1, name: 'karmiy'});

    o = p;
    // p = o;

    let c1 = (a:number) => {};
    let c2 = (a:number) => 1;
    c1 = c2;
    // c2 = c1;

    declare let y1:(a:number, b:string) => void;
    declare let y2:(a:number, b:string) => never;
    y1 = y2;
    // y2 = y1;

    let v11 = {id: 123};
    let v22 = {id: 123,name: 'k'};
    v11 = v22;


    // 参数与返回值混合类型兼容性
    let t1 = (a:number, b:string) => 1;
    let t2 = (a:number) => '1';
    // t1 = t2;
    // t2 = t1;

    let u1 = (a:number, b:string) => 1;
    let u2 = (a:string) => 100;
    // u1 = u2;
    // u2 = u1;

    let r1 = (a:number, b:string) => 1;
    let r2 = (a:number) => 100;
    r1 = r2;
    // r2 = r1;

    let z1 = (a:number, b:string) => 1;
    let z2 = (a:string) => '1';
    // z1 = z2;
    // z2 = z1;

    // 分析 - 参数数量问题
    function loop(arr:number[], callback:(item:number, index:number, arr:number[]) => void) {
        for(let i = 0, len = arr.length; i < len; i++) {
            callback(arr[i], i, arr);
        }
    };
    loop([1, 2, 3], (item:number) => {
        console.log(item);
    });

    // 分析 - 返回值问题
    function catchUserName(id: number,callback: (id:string) => {name: string}) {
        const user = callback('k_id_' + id);
        return user.name;
    }

    catchUserName(10, ((id: string) => {
        // 假设做了一次请求查询数据库数据
        return {
            id: 'k_id_10',
            name: 'karmiy',
            code: 'a30129908',
            parentId: 0,
        }
    }));


    // 剩余参数
    let x = (a:number, b:number) => 0;
    let y = (...rest:number[]) => 0;
    /* let x = (a?:number, b?:string, c?:string) => 1;
    let y = (b:number, c:string) => 0; */

    y = x;
    x = y;

    function invokeLater(callback: (...args: number[]) => void) {
        /* ... Invoke callback with 'args' ... */
    }
    
    // Unsound - invokeLater "might" provide any number of arguments
    invokeLater((x:number, y:number) => console.log(x + ", " + y));
    
    // Confusing (x and y are actually required) and undiscoverable
    invokeLater((x?:number, y?:number) => console.log(x + ", " + y));


    // 参数是子类型的兼容性
    interface Event {timestamp: number}
    interface MouseEvent extends Event {x:number; y: number}

    let event: Event = {
        timestamp: 1578987358436,
    };
    let mouseEvent: MouseEvent = {
        timestamp: 1578987358436,
        x: 200,
        y: 400,
    };
    event = mouseEvent;
    // mouseEvent = event;

    let eventFunc:(e: Event) => void = e => {};
    let mouseEventFunc:(e: MouseEvent) => void = e => {};

    mouseEventFunc = eventFunc;
    // eventFunc = mouseEventFunc;

    function listenEvent(callback: (e: MouseEvent) => void) {
        const e = {
            timestamp: 1578987358436,
            x: 200,
            y: 400,
        };
        callback(e);
    }

    listenEvent((e: Event) => console.log(e.timestamp));

    // 枚举类型兼容性
    /* enum Direct {
        Up = 'Up',
        Down = 'Down',
        Left = 'Left',
        Right = 'Right',
    } */
    enum Direct {
        Up,
        Down,
        Left,
        Right,
    }
    let up = Direct.Up;
    let num = 199;
    up = num;
    num = up;

    enum Direct_1 {
        Up,
        Down,
        Left,
        Right,
    }

    enum Direct_2 {
        Up,
        Down,
        Left,
        Right,
    }

    let up_1 = Direct_1.Up;
    let up_2 = Direct_2.Up;
    // up_1 = up_2;
    // up_2 = up_1;

    // 数组的兼容性
    let arr_1:Array<number | boolean> = [1, true];
    let arr_2:Array<number> = [1, 2, 3];
    arr_1 = arr_2;
    // arr_2 = arr_1;

    let arr_3:Array<number | string> = [1, 2, 3];
    let arr_4:[number, string] = [1, '2'];
    arr_3 = arr_4;
    // arr_4 = arr_3;

    // 类的类型兼容性
    // 1
    class Group {
        item: number = 10;
        constructor(id: number, name: string) {}
        handler(name: string) {}
    }
    class Option {
        item: number = 0;
        constructor(code: string) {}
        handler(name: string, id?:number) {}
    }
    let group: Group = new Group(10, 'k');
    let option: Option = new Option('0312');
    group = option;
    option = group;

    // 2
    class Ani {
        private eat:() => void = () => console.log('eat');
        protected age:number = 11;
    }
    class Dog extends Ani {};
    class Bird extends Ani {};

    let dog:Dog = new Dog();
    let bird:Bird = new Bird();
    dog = bird;
    bird = dog;

    class Fox {
        private eat:() => void = () => console.log('eat');
        protected age:number = 11;
    }
    let fox:Fox = new Fox();
    // fox = bird;
    // bird = fox;


    // 泛型的类型兼容性
    interface Person<T> {
        name: T;
    }
    let person_1: Person<number> = {name: 10};
    let person_2: Person<string> = {name: 'k'};
    // person_1 = person_2;
    // person_2 = person_1;
}