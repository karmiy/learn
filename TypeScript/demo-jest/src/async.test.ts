import { getUsers } from './async';

test('test async', async () => {
    const users = await getUsers() as Array<string>;
    expect(users).not.toBeUndefined();
    expect(users.length).toEqual(2);
})