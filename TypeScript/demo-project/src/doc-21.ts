const a:number = 100;
const b = BigInt(10);

function foo(a: number, b: string): string {
    return a + b;
}
foo.apply(undefined, [1]);
export {};