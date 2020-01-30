import { add } from './add';

test('is four', () => {
    expect(add(2, 2)).toBe(4);
});

test('is not six', () => {
    expect(add(2, 2)).not.toBe(6);
});