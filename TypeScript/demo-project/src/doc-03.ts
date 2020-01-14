namespace doc_03 {
    // 原始类型

    // 1、boolean
    const isLoading: boolean = false;

    // 2、number
    const n1: number = 6;
    const n2: number = 0xf00d;
    const n3: number = 0b1010;
    const n4: number = 0o744;

    // 3、string
    const str = 'Karmiy';

    // 4、void
    // 通常当函数没有返回值使用
    function build(): void {
        console.log('123');
    }
    // 只有 undefined 可以赋值给void
    const v1: void = undefined;

    // 5、null 与 undefined
    const n: null = null;
    const u: undefined = undefined;
    // 默认情况下 null 与 undefined 是所有类型的子类型
    // 即可以把它们赋值给 number
    // 但是项目开发中一般开启 --strictNullChecks
    // 即 null 与 undefined 只能赋值给 any 与它们自己(特例 undefined 可以给 void)
    // 即 const nu: number = null; 默认是可以的，strictNullChecks 下不行

    // 6、symbol
    // 使用 symbol，需要在 tsconfig.json 里添加 es6 编译辅助库:
    // "lib": ["es6", "dom"]

    const sym: symbol = Symbol('key');

    // 7、BigInt
    // 在 TypeScript3.2 版本内置，可以安全地存储和操作大整数
    // 使用 BigInt，需要在 tsconfig.json 里添加 ESNext 编译辅助库:
    // "lib": ["es6", "dom", "ESNext"]
    const bigNumber: bigint = BigInt(Number.MAX_SAFE_INTEGER);

    // 其他类型

    // any
    let a: any = 4;
    a = '123'; // ok

    // unknown
    let any_value: any;

    any_value = true;             // OK
    any_value = 1;                // OK
    any_value = "Hello World";    // OK
    any_value = Symbol("type");   // OK
    any_value = {}                // OK
    any_value = []                // OK

    let unknown_value: unknown;

    unknown_value = true;             // OK
    unknown_value = 1;                // OK
    unknown_value = "Hello World";    // OK
    unknown_value = Symbol("type");   // OK
    unknown_value = {}                // OK
    unknown_value = []                // OK

    // 区别
    any_value.foo.bar;  // OK
    any_value();        // OK
    new any_value();    // OK
    any_value[0][1];    // OK

    // unknown_value.foo.bar;  // ERROR
    // unknown_value();        // ERROR
    // new unknown_value();    // ERROR
    // unknown_value[0][1];    // ERROR

    function getStrValue(value: unknown): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return String(value);
    }

    // never
    function err(message: string): never {
        throw new Error(message);
    }

    const emptyArr: never[] = [];
    // emptyArr.push(1); // ERROR

    // Array
    const list: Array<Number> = [1, 2, 3];
    const group: Number[] = [4, 5, 6];

    // Tuple
    let options: [string, number];
    options = ['karmiy', 1]; // ok
    // options = [1]; // ERROR
    // options = ['karmiy', 1, false]; // ERROR
    // options = [1, 'karmiy']; // ERROR

    interface Options extends Array<string | number> {
        0: string;
        1: number;
        length: 2;
    }

    // options.push(false); // ERROR
    options.push(2); // ok
    console.log(options); // ['karmiy', 1, 2]
    // console.log(options[2]); // ERROR: Tuple type '[string, number]' of length '2' has no element at index '2'.

    // object
    enum Direct {
        Center = 1
    }
    let obj: object = [1, 2, 3];
    obj = {};
    obj = new Number(1);
    obj = Direct;
}
// export {};