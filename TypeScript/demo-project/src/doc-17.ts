namespace doc_17 {
    interface Company {
        id:number;
        name:string;
    }
    interface Person {
        id:number;
        name:string;
        code?:string;
        age?:number;
        // company: Company;
    }
    // Partial
    type Partial<T> = {
        [K in keyof T]?:T[K];
    }
    type P = Partial<Person>;

    // DeepPartial
    type DeepPartial<T> = {
        [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
    }
    type D = DeepPartial<Person>;

    // Required
    type Required<T> = {
        [K in keyof T]-?: T[K];
    }
    type R = Required<Person>;

    // Pick
    type Pick<T, U extends keyof T> = {
        [K in U]: T[K];
    }
    type PK = Pick<Person, 'id' | 'name'>;

    // Exclude
    type Exclude<T, U> = T extends U ? never : T;
    type E = Exclude<'x' | 'a' | 'b', 'x' | 'y' | 'z'>;

    // Omit
    type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;
    type O = Omit<Person, 'name' | 'code'>;

    // Merge
    type Compute<A extends any> =
    A extends Function
    ? A
    : { [K in keyof A]: A[K] };
    type C = Compute<{x: 'x'} & {y: 'y'}>;

    type Merge<T extends object, U extends object> = Compute<T & Omit<U, keyof T>>;
    type M = Merge<{id:number; name:string}, {id:number; age?:number}>;

    // Extract
    type Extract<T, U> = T extends U ? T : never;
    type Ex = Extract<'x' | 'a' | 'b', 'x' | 'y' | 'b'>;

    // Intersection
    type Intersection<T extends object, U extends object> = Pick<T, Extract<keyof T, keyof U>>
    type I = Intersection<{id:number; name:string}, {name:string; age?:number}>;

    // Diff
    type Diff<T extends object, U extends object> = Pick<T, Exclude<keyof T, keyof U>>;
    type Df = Diff<{ name: string; age: number; visible: boolean }, { age: number }>;

    // Overwrite
    type Overwrite<
        T extends object, 
        U extends object,
        I = Diff<T, U> & Intersection<U, T>
    > = Pick<I, keyof I>;
    type Ov = Overwrite<{ name: string; age: number; visible: boolean }, { age: string }>;

    // Mutable
    type Mutable<T> = {
        -readonly [K in keyof T]: T[K];
    };
    type Mu = Mutable<{
        readonly id: number;
        readonly name: string;
        code: string;
    }>;
}