// 数字枚举
enum Direct_1 {
    Up,
    Down,
    Left,
    Right,
}

console.log(Direct_1.Up); // 0
console.log(Direct_1.Down); // 1
console.log(Direct_1.Left); // 2
console.log(Direct_1.Right); // 3

enum Direct_2 {
    Up = 10,
    Down,
    Left,
    Right,
}

console.log(Direct_2.Up); // 10
console.log(Direct_2.Down); // 11
console.log(Direct_2.Left); // 12
console.log(Direct_2.Right); // 13

enum Direct_3 {
    Up,
    Down,
    Left = 102,
    Right,
}

console.log(Direct_3.Up); // 0
console.log(Direct_3.Down); // 1
console.log(Direct_3.Left); // 102
console.log(Direct_3.Right); // 103

// 字符串枚举
enum Direct_4 {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
}

console.log(Direct_4.Up); // 'Up'
console.log(Direct_4.Down); // 'Down'
console.log(Direct_4.Left); // 'Left'
console.log(Direct_4.Right); // 'Right'

enum Direct_5 {
    Up,
    Down,
    Left = 'Left',
    Right = 'Right',
}

console.log(Direct_5.Up); // 0
console.log(Direct_5.Down); // 1
console.log(Direct_5.Left); // 'Left'
console.log(Direct_5.Right); // 'Right'

// 异构枚举
enum Direct_6 {
    Up = 0,
    Down = 1,
    Left = 'Left',
    Right = 'Right',
}

// 反向映射
enum Direct_7 {
    Up,
    Down,
    Left,
    Right,
}

console.log(Direct_7['Up']); // 0
console.log(Direct_7[0]); // 'Up'

// 常量枚举
const enum Direct_8 {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
}

const c = Direct_8.Up; // 'Up'


