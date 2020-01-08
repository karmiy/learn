// 1、boolean
const isLoading: boolean = false;

// 2、number
const n1: number = 6;
const n2: number = 0xf00d;
const n3: number = 0b1010;
const n4: number = 0o744;

// 3、string
const str = 'Karmiy';

// 4、void
// 通常当函数没有返回值使用
function build(): void {
    console.log('123');
}
// 只有 undefined 可以赋值给void
const v1: void = undefined;

// 5、null 与 undefined
const n: null = null;
const u: undefined = undefined;
// 默认情况下 null 与 undefined 是所有类型的子类型
// 即可以把它们赋值给 number
// 但是项目开发中一般开启 --strictNullChecks
// 即 null 与 undefined 只能赋值给 any 与它们自己(特例 undefined 可以给 void)
// 即 const nu: number = null; 默认是可以的，strictNullChecks 下不行

