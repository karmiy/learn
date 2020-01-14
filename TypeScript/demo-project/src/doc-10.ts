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
// 可选参数
let u = (a:number, b?:string) => 1;
let v = (a:number) => 0;
v = u;
u = v;

// 参数类型一致
let o = (a:number) => ({id: 1});
let p = (a:number) => ({id: 1, name: 'karmiy'});

o = p;
// p = o;

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



export {};