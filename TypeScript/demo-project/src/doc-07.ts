namespace doc_07 {
    // 定义函数
    interface Add {
        (x: number, y: number): number;
    }
    const add: Add = (x, y) => x + y;
    function subtract(x: number, y: number) {
        return x - y;
    }

    // 无返回值
    function fn(): void {
        console.log('1');
    }

    // 可选参数
    function multiply(x: number, y: number, z?: number) {
        return x * y * (z || 1);
    }

    multiply(1, 2);
    multiply(1, 2, 3);

    // 默认参数
    function divide(x: number, y: number = 10) {
        return x / y;
    }

    // 剩余参数
    function plus(...rest: Array<number>) {
        return rest.reduce((sum, cur) => sum + cur, 0);
    }
    console.log(plus(1, 2, 3));

    // 重载

    function assign(all: number): number
    function assign(a: number, b: number): number
    function assign(a: number, b: number, c: number, d: number): number
    function assign(a: number, b?: number, c?: number, d?: number) {
        return a + (b || 0) + (c || 0) + (d || 0);
    }

    assign(1);
    assign(1, 2);
    // assign(1, 2, 3);
    assign(1, 2, 3, 4);
}