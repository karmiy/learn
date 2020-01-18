namespace doc_15 {
    declare function func<T extends boolean>(param: T): T extends true ? string : number;

    const x = func(Math.random() < .5);
    const y = func(false);
    const z = func(true);

    type e_1 = boolean extends boolean ? boolean : number;
    type e_2 = true extends boolean ? boolean : number;
    type e_3 = 'k' extends string ? number : boolean;
    type e_4 = string extends string ? number : boolean;
    type e_5 = (string | number) extends string ? number : boolean;
    type e_6 = { name: string; id: number } extends { name: string } ? string : number;
    type e_7 = ((a: number) => void) extends ((a: number, b: number) => void) ? string : number;
    type e_8 = (() => { name: string; id: number }) extends (() => { name: string }) ? string : number;


    // 分布式有条件类型
    // 裸类型参数,没有被任何其他类型包裹即T
    type NakedUsage<T> = T extends boolean ? 'YES' : 'NO';
    // 参数类型被包装在数组中即Array<T>
    type WrappedUsage<T> = Array<T> extends Array<boolean> ? 'YES' : 'NO';

    type Distributed = NakedUsage<number | boolean>;
    type NotDistributed = WrappedUsage<number | boolean>;

    // Diff
    type Diff<T, U> = T extends U ? never : T;
    type D = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>;

    type Filter<T, U> = T extends U ? T : never;
    type F = Filter<string | number | (() => void), Function>;

    type NonNullable<T> = Diff<T, undefined | null>;
    type N = NonNullable<string | number | null>;

    // 条件类型与映射类型
    interface Part {
        id: number;
        name: string;
        subparts: Part[];
        updatePart(newName: string): void;
    }

    type FunctionPropertyNames<T> = {
        [K in keyof T]: T[K] extends Function ? K : never;
    }[keyof T]

    type PartFuncNames = FunctionPropertyNames<Part>;

    // PartialKeys
    interface People {
        id: string;
        name: string;
        age?: number;
        from?: string;
        speak?: () => void;
    }

    // 方式一
    type PartialKeys<T> = {
        [K in keyof T]-?: undefined extends T[K] ? K : never; 
    }[keyof T]

    type R = PartialKeys<People>;
    
    // 方式二 - 解析
    interface A {
        id:number;
        name?:string;
        code?:string;
    }
    interface B {
        id:number;
        name:string;
        code:string;
    }
    // 将 B 的 name 置为可选
    interface B_1 {
        id:number;
        name?:string;
        code:string;
    }
    // 将 B 的 id 置为可选
    interface B_2 {
        id?:number;
        name:string;
        code:string;
    }
    type isChild_1 = B_1 extends A ? true : false; // true
    type isChild_2 = B_2 extends A ? true : false; // false

    // 方式二
    // 是否可选
    type isPartial<T, U extends keyof T> = {
        [K in Exclude<keyof T, U>]-?: T[K];
    } & { 
        U?: T[U];
    } extends T ? true : false;
    type T_1 = isPartial<People, 'name'>
    type T_2 = isPartial<People, 'age'>

    type PartialKeys_2<T> = {
        [K in keyof T]-?: isPartial<T,K> extends true ? K : never;
    }[keyof T];

    type RR = PartialKeys_2<People>;
}