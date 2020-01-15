namespace doc_11 {
    // 交叉类型
    interface A {
        id: number;
        name: string;
    }
    interface B {
        name:string;
        move():void;
    }
    const cross:A & B = {
        id: 1,
        name: 'karmiy',
        move(){},
    }; 

    // mixin
    interface IObject {
        [prop:string]:any;
    }
    function mixin<T extends IObject, U extends IObject>(first:T, second:U):T & U {
        const result = <T & U>{};
        for(let id in first) {
            (<T>result)[id] = first[id];
        }
        for(let id in second) {
            if(!result.hasOwnProperty(id)) {
                (<U>result)[id] = second[id];
            }
        }
        return result;
    }
    const result = mixin(
        {id: 1, name: 'k'},
        {code: '0123'}
    )

    // 联合类型
    let union:string | number;
    union = 'k';
    union = 123;
    // union = true;

    interface Bird {
        fly():void;
        layEggs():void;
    }
    
    interface Fish {
        swim():void;
        layEggs():void;
    }
    function getSmallPet(pet: Bird | Fish): Bird | Fish {
        pet.layEggs();
        // pet.fly();
        // pet.swim();
        return pet;
    }

    // 类型别名
    type UnPlainStr = string | number;
    const str_1:UnPlainStr = '1';
    const str_2:UnPlainStr = 1;
    // const str_3:UnPlainStr = true;

    // 类型别名-泛型
    type Tree<T> = {
        name: T;
        tree?: Tree<T>
    }
    const tree: Tree<string> = {
        name: 'karmiy',
        tree: {
            name: 'kamriy',
        }
    }

    // 类型别名-交叉类型
    type LinkedList<T> = T & { next?: LinkedList<T> }
    interface Person {
        name: string;
    }
    let person:LinkedList<Person>;
    person = { name: 'karmiy' };
    person = { name: 'karmiy', next: { name: 'karmiy' } };
    person = { name: 'karmiy', next: { name: 'karmiy', next: { name: 'kamriy' } } };

    type Alias = { num: number }
    interface Interface {
        num: number;
    }
}