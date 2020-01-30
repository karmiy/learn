export class Person {
    public name: string;
    public age: number;
    constructor(name: string, age: number) {
        this.age = age;
        this.name = name;
    }

    public say() {
        return 'hello';
    }
}