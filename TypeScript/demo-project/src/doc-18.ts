namespace doc_18 {
    // 注释
    interface Person {
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
    type CarList = Record<Car, { age: number }>

    const cars: CarList = {
        Audi: { age: 119 },
        BMW: { age: 113 },
        MercedesBenz: { age: 133 },
    }

    // LeetCode
    interface Action<T> {
        payload?: T
        type: string
    }

    class EffectModule {
        count = 1;
        message = "hello!";

        delay(input: Promise<number>) {
            return input.then(i => ({
                payload: `hello ${i}!`,
                type: 'delay'
            }));
        }

        setMessage(action: Action<Date>) {
            return {
                payload: action.payload!.getMilliseconds(),
                type: "set-message"
            };
        }
    }

    type methodsPick<T> = {
        [K in keyof T]: T[K] extends Function ? K : never;
    }[keyof T];

    // 转换前
    type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>;
    // 转换后
    type asyncMethodConnect<T, U> = (input: T) => Action<U>;

    // 转换前
    type syncMethod<T, U> = (action: Action<T>) => Action<U>;
    // 转换后
    type syncMethodConnect<T, U> = (action: T) => Action<U>;

    type EffectModuleMethodsConnect<T> = 
        T extends asyncMethod<infer U, infer V>
        ?
        asyncMethodConnect<U, V>
        :
        T extends syncMethod<infer U, infer V>
        ?
        syncMethodConnect<U, V>
        :
        never;

    type EffectModuleMethods = methodsPick<EffectModule>;

    type Connect = (module: EffectModule) => {
        [K in EffectModuleMethods]: EffectModuleMethodsConnect<EffectModule[K]>;
    }
}