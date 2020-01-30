const a:number = 100;
const b = BigInt(10);

function foo(a: number, b: string): string {
    return a + b;
}
// foo.apply(undefined, [1]);

async function A () {
    await new Promise(r => setTimeout(r, 1000));
    await new Promise(r => setTimeout(r, 1000));
    return new Promise(r => setTimeout(r, 1000));
}
export {
    A,
};