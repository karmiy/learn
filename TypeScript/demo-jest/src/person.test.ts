import { Person } from './person';

test('test person', () => {
    const person = new Person('karmiy', 18);

    expect(person).toBeInstanceOf(Person);
    expect(person).not.toEqual({
        name: 'karloy',
    })
});