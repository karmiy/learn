## infer 关键字

infer 是工具类型与底层库中非常常用的关键字

表示在 extends 条件语句中待推断的类型变量

### 条件类型与 infer

假设我们需要实现一个工具类型 ParamType ，用于获取函数的参数类型

    type Param = ParamType<(a:number) => string>;

    结果：
    type Param = number;

那我们应该如何设计？

    type ParamType<T> = T extends Function ? number : T;

这显然是不行的，我们无法从函数类型 T 中获取它的参数类型

    type ParamType<T> = ((a:T) => void) extends Function ? T : Function;

这虽然返回了参数类型 T，但是这个 T 确是我们自己传递的而不是根据函数得来的

    type ParamType<T> = T extends (a:P) => void ? P : T;

到这一步调整，答案已经很接近了，只是这个 P 会报错，我们该如何向 TypeScript 表示这个 P 变量

TypeScript 提供了 **infer 关键字表示待推断**

    type ParamType<T> = T extends (a: infer P) => void ? P : T;

infer 关键字一般用于这种存在未知待推断类型，返回值也需要用到的场景

> 实现 ReturnType 类型工具，用于获取函数的返回值类型

    type ReturnType<T> = T extends (...rest:any[]) => infer P ? P : any;
    type R = ReturnType<(a:number) => boolean>;

    结果：
    type R = boolean;

> 实现 ConstructorParameters 类型工具，用于获取构造函数中的参数

    type ConstructorParameters<T> = T extends new (...args:infer P) => any ? P : never;

    class Animal {
        constructor(name:string, id:number){}
    }
    type C = ConstructorParameters<typeof Animal>; // 注意要 typeof Animal 才是 Animal 构造函数类型，Animal 是实例类型

    结果：
    type C = [string, number];

### infer 的应用

infer 非常强大，由于它的存在我们可以实现许多工具类型

1、元组 tuple 转 联合类型 union，如 [string, number] => string | number：

    type ElementOf<T> = T extends Array<infer P> ? P : never;
    type Tuple = [string, number];
    type Union = ElementOf<Tuple>;

    结果：
    type Union = string | number

2、联合类型 union 转 交叉类型 intersection，如 {id:number} | {name:string} => {id:number} & {name:string}

    type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
    type Intersection = UnionToIntersection<{id:number} | {name:string}>;

    结果：
    type Intersection = {id:number} & {name:string};

分析：

- UnionToIntersection 中有2个条件类型 extends

- 第一个条件类型 U extends any 是 **分布式有条件类型**，当我们将 {id:number} | {name:string} 传入时，会被解析为：({id:number} extends any ? (k:{id:number}) => void : never) | ({name:string} extends any ? (k:{name:string}) => void : never)

- 第二个条件类型 (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) 不是分布式有条件类型，所以会解析为：((k:{id:number}) => void | (k:{name:string}) => void) extends ((k: infer I) => void)

