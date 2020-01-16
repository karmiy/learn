namespace doc_13 {
    // 类装饰器
    function addAge(age:number) {
        return function(constructor: Function) {
            constructor.prototype.age = age;
        }
    }

    @addAge(18)
    class Person {
        name!: string;
        age!: number;
        constructor() {
            this.name = 'karmiy'; 
        }
    }
    const person = new Person();
    console.log(person.age);

    // 方法装饰器
    function method(target:any, propertyKey:string, descriptor: PropertyDescriptor) {
        console.log(target);
        console.log('prop: ' + propertyKey);
        console.log('desc: ' + JSON.stringify(descriptor));
        const originMethod = descriptor.value;
        descriptor.value = function(...args:any[]) {
            console.log('new method');
            return originMethod.apply(this, args);
        }
    }
    class Animal {
        @method
        move() {
            console.log('move');
        }

        @method
        static run() {
            console.log('run');
        }
    }
    // const animal = new Animal();
    // animal.move = function() {};

    // 属性装饰器
    function log(target: any, propertyKey: string) {
        console.log(target);
        console.log('prop: ' + propertyKey);
        
        let value = 0;
        const get = function() {
            console.log('Getter: ' + value);
            return value;
        }
        const set = function(val: number) {
            console.log('Setter: ' + val);
            value = val;
        }
        Object.defineProperty(target, propertyKey, {
            get,
            set,
            enumerable: true,
            configurable: true,
        })
    }
    class Calculator {
        @log
        public num!: number;
        square() {
            return this.num * this.num;
        }
    }
    const cal = new Calculator();
    cal.num = 2;
    cal.num;

    // 访问装饰器
    function configurable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target);
        console.log('prop: ' + propertyKey);
        console.log('desc: ' + JSON.stringify(descriptor));
    }
    class Point {
        private _x:number = 100;
        private _y:number = 200;
        
        @configurable
        get x() {
            return this._x;
        }
        
        @configurable
        set y(val:number) {
            this._y = val;
        }
    }

    // 参数装饰器
    const modalParseConf:Array<'number' | 'string' | 'boolean'> = [];
    function parse(type:'number' | 'string' | 'boolean') {
        return function(target:any, propertyKey:string, index:number) {
            modalParseConf[index] = type;
        }
    }
    function parseFunc(target:any, propertyKey:string, descriptor:PropertyDescriptor) {
        const originMethod = descriptor.value;
        descriptor.value = function(...args:any[]) {
            modalParseConf.forEach((type, index:number) => {
                switch (type) {
                    case 'number':
                        args[index] = Number(args[index]);
                        break;
                    case 'string':
                        args[index] = String(args[index]);
                        break;
                    case 'boolean':
                        args[index] = !!args[index];
                        break;
                }
            });
            return originMethod.apply(this, args);
        }
    }
    class Modal {
        @parseFunc
        add(@parse('number') prev:number | string | boolean, @parse('string') next:number | string | boolean) {
            console.log(prev);
            console.log(next);
            return <number>prev + <string>next;
        }
    }
    const modal = new Modal();
    console.log(modal.add('8', 9));

    // 多个装饰器
    function printName_1() {
        console.log('1');
        return function(target: any, propertyKey: string) {
            console.log('4');
        }
    }
    function printName_2() {
        console.log('2');
        return function(target: any, propertyKey: string) {
            console.log('3');
        }
    }
    class Wrap {
        @printName_1()
        @printName_2()
        name:string = 'wrap';
    }

    console.log('-------------------');
    

    // 执行顺序
    function logClass(param:string) {
        console.log('class logic: ' + param);
        return function(target:any) {
            console.log('class decorator: ' + param);
        }
    }
    function logProperty(param:string) {
        console.log('property logic: ' + param);
        return function(target: any, propertyKey: string) {
            console.log('property decorator: ' + param);
        }  
    }
    function logAccess(param:string) {
        console.log('access logic: ' + param);
        return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log('access decorator: ' + param);
        } 
    }
    function logMethod(param:string) {
        console.log('method logic: ' + param);
        return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log('method decorator: ' + param);
        } 
    }
    function logParameter(param:string) {
        console.log('parameter logic: ' + param);
        return function(target: Object, propertyKey: string, index: number) {
            console.log('parameter decorator: ' + param);
        } 
    }
    @logClass('group')
    class Group {
        @logMethod('run')
        static run(@logParameter('num') num:number) {}

        @logAccess('x')
        get x() {
            return 10;
        }

        @logMethod('push')
        push(@logParameter('option') option:string, @logParameter('index') index:number) {

        }
        constructor(@logParameter('constructor') code:string) {
            this.code = code;
        }
        @logProperty('code')
        code!:string;
    }
    
}