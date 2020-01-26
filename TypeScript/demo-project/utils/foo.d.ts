/* declare const name: string;
declare function getName(): string;
declare class Animal {
    constructor(name: string);
}
declare enum Direct {
    Up,
    Down,
    Left,
    Right,
}

interface Option {
    data: {
        id: number;
        name: string;
    },
}

declare namespace bar {
    const name: string;
    function baz(): void;
}

export {
    name,
    getName,
    Animal,
    Direct,
    Option,
    bar,
}

export default foo;

declare namespace foo {
    function init(): void;
} */

export default foo;

declare function foo(): void;
declare namespace foo {
    const bar: number;
}
declare global {
    interface Array<T> {
        prepend(): void;
    }
}