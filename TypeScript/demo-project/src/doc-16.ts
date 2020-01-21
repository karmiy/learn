namespace doc_16 {
    type ParamType<T> = T extends (a: infer P) => void ? P : T;
    type P = ParamType<(a:number) => string>;

    type ReturnType<T> = T extends (...rest:any[]) => infer P ? P : any;
    type R = ReturnType<(a:number) => boolean>;

    type ConstructorParameters<T> = T extends new (...args:infer P) => any ? P : never;
    class Animal {
        name:string = 'dog';
        constructor(name:string, id:number){}
    }
    type C = ConstructorParameters<typeof Animal>;

    // 元组转联合
    type ElementOf<T> = T extends Array<infer P> ? P : never;
    type Tuple = [string, number];
    type E = ElementOf<Tuple>;

    type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
    type Intersection = UnionToIntersection<{id:number} | {name:string}>;
}
