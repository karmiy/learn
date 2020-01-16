namespace doc_12 {
    // 字面量类型
    const literals_1:10 = 10;
    const literals_2:0b10 = 2;
    const literals_3:0o114 = 0b1001100;
    const literals_4:0x514 = 0x514;
    const literals_5:'k' = 'k';
    const literals_6:true = true;

    // const literals:'k' = 'kk';
    type Direct = 'Up' | 'Down' | 'Left' | 'Right';
    const direct:Direct = 'Up';

    // 类型字面量
    type Foo = {
        baz: [
          number,
          'karmiy'
        ];
        toString(): string;
        readonly [Symbol.iterator]: 'github';
        0x1: 'foo';
        "bar": {
            name: 'kealm',
        };
    };
    const foo:Foo = {
        baz: [1, 'karmiy'],
        toString: () => 'str',
        [Symbol.iterator]: 'github',
        0x1: 'foo',
        bar: {
            name: 'kealm',
        },
    }

    // 可辨识联合类型
    type UserAction = {
        id:number;
        method: 'delete',
    } |
    {
        method: 'create',
    };

    const userReducer = (userAction: UserAction) => {
        switch(userAction.method) {
            case 'create':
                // ...
                break;
            case 'delete':
                console.log(userAction.id);
                // ...
                break;
        }
    }
}