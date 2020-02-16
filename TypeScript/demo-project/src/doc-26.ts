namespace doc_26 {
    function fn({ x }: { x: number } = { x: 0 }) {
        console.log(x);
    }

    const map = new Map([
        ['F', 'no'],
        ['T', 'yes'],
    ]);
    for (let key of map.keys()) {
        console.log(key);
    }

    // 泛型与条件类型
    interface IUser {
        id: number;
    }
    function ep<S extends IUser>() {
        let v: S extends IUser ? true : false;
        // v = true;
        // v = false;
    }
}