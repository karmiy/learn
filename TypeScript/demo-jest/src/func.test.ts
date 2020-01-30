import { myForEach } from './func';

test('test func', () => {
    const callback = jest.fn();
    myForEach([0, 1], callback);

    // 模拟函数被调用 2 次
    expect(callback.mock.calls.length).toBe(2);
    // 第一次调用，第一个参数是 0
    expect(callback.mock.calls[0][0]).toBe(0);
    // 第二次调用，第一个参数是 1
    expect(callback.mock.calls[1][0]).toBe(1);
    console.log(callback.mock);

})