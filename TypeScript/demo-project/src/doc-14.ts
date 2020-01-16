namespace doc_14 {
    // 索引类型
    interface Obj {
        [key:string]:any;
    }
    function pick<T, K extends keyof T>(object:T, keys:K[]):T[K][] {
        return keys.map(key => object[key]);
    }

    const user = {
        id: 1,
        name: 'karmiy',
        role: 'manager',
    }
    pick(user, ['id', 'name']);




    // 索引类型查询操作符
    class Images {
        public src:string = 'xxx';
        public alt:string = 'yyy';
        public width:number = 200;
        private title:string = 'zzz';
    }
    type props = keyof Images;

    // 索引访问操作符
    type values = Images[props];

    class Wrap {
        width!:number;
        height!:number;
        content!:string;
    }
    type widthStr = 'width';
    type widthType_1 = Wrap[widthStr];
    type widthType_2 = Wrap['width'];
    
    // 映射类型
    interface Person {
        id:number;
        name:string;
        code:string;
        age:number;
    }

    type Plain = 'a' | 2 | number;
    type Loop = {
        [K in Plain]:K;
    }

    type partial<T> = {
        [K in keyof T]?:T[K];
    }

    type partialPerson = partial<Person>;
}