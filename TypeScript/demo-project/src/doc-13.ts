namespace doc_13 {
    function addAge(constructor: Function) {
        constructor.prototype.age = 18;
    }

    @addAge
    class Person {
        name!: string;
        age!: number;
        constructor() {
            this.name = 'karmiy'; 
        }
    }
    const person = new Person();
    console.log(person.age);

}