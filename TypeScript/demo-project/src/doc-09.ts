namespace doc_09 {
    // 类型断言
    interface User {
        id: number;
        name: string;
    }
    const user = {} as User;
    (<User>user).id = 1;
    user.name = 'karmiy';

    function getLength(r: string | number) {
        if ((<string>r).length) {
            return (<string>r).length;
        } else {
            return r.toString().length;
        }
    }

    // 双重断言
    const u = 'karmiy' as unknown as User;

    // instanceof
    class Person {
        id: number = 1;
        name: string = 'karmiy';
    }

    class Animal {
        type: string = 'cat';
        name: string = 'blackWhite';
    }

    function logInfo(r: Person | Animal) {
        if (r instanceof Person) {
            console.log(r.id);
            console.log(r.name);
        } else {
            console.log(r.type);
            console.log(r.name);
        }
    }

    logInfo(new Animal());

    // in
    interface Per {
        id: number;
        name: string;
    }
    interface Ani {
        type: string;
        name: string;
    }

    function logInf(r: Per | Ani) {
        if ('id' in r) {
            console.log(r.id);
            console.log(r.name);
        }
        if ('type' in r) {
            console.log(r.type);
            console.log(r.name);
        }
    }
    logInf({
        id: 1,
        name: 'karmiy',
    });

    // typeof
    interface F {
        (): string;
    }
    function getName(r: string | F) {
        if (typeof r === 'string') {
            return r;
        } else {
            return r();
        }
    }

    // 字面量类型守卫
    interface P {
        kind: 'p',
        name: string;
    }
    interface A {
        kind: 't',
        content: string;
    }
    function logMes(r: P | A) {
        if (r.kind === 'p') {
            console.log(r.kind);
            console.log(r.name);
        }
        if (r.kind === 't') {
            console.log(r.kind);
            console.log(r.content);
        }
    }

    // 自定义类型守卫
    interface Fish {
        swim(): void;
    }
    interface Bird {
        fly(): void;
    }

    function isFish(r: any): r is Fish {
        return (r as Fish).swim !== undefined;
    }

    function motion(pet: Fish | Bird) {
        if (isFish(pet)) {
            pet.swim();
        } else {
            pet.fly();
        }
    }

    function isString(r: any): r is string {
        return Object.prototype.toString.call(r) === '[object String]';
    }

    function isNumber(r: any): r is number {
        return Object.prototype.toString.call(r) === '[object Number]';
    }

    function logType(r: any) {
        if (isString(r)) {
            r.split('');
            console.log('is string');
        }
        if (isNumber(r)) {
            r.toFixed(2);
            console.log('is number');
        }
    }
}

// export {};