namespace doc_18 {
    // 注释
    interface Person{
        id: number;
        /** 名称 */
        name: string;
    }

    // ReturnType 与 typeof
    function add(a: number, b: number) {
        return a + b;
    }
    type addReturn = ReturnType<typeof add>;

    // Omit
    type Collapse = {
        value: string | number | Array<string | number>;
        accordion: boolean;
        iconLeft: boolean;
        name: string;
    }
    type CollapseItem = Omit<Collapse, 'iconLeft' | 'accordion'>;

    // Record
    type Car = 'Audi' | 'BMW' | 'MercedesBenz'
    type CarList = Record<Car, {age: number}>

    const cars: CarList = {
        Audi: { age: 119 },
        BMW: { age: 113 },
        MercedesBenz: { age: 133 },
    }
}