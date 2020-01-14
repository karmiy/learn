namespace doc_05 {
    // 使用接口
    interface User_1 {
        id: string;
        name: string;
        age: number;
    }
    function getUserName_1(user: User_1): string {
        return user.name;
    }

    const user1: User_1 = { id: '01', name: 'karmiy', age: 18 };
    // const user2: User_1 = {id: '02', name: 'karloy'};


    // 可选属性
    interface User_2 {
        id: string;
        name: string;
        age?: number;
    }

    function getUserName_2(user: User_2): string {
        return user.name;
    }

    // 只读属性
    interface User_3 {
        readonly id: string;
        name: string;
        age?: number;
    }

    const user3: User_3 = { id: '01', name: 'karmiy' };
    // user3.id = '001';

    // 函数属性
    interface User_4 {
        readonly id: string;
        name: string;
        age?: number;
        // say: (content: string) => string;
        say(content: string): string;
    }
    const user4: User_4 = {
        id: '101',
        name: 'karmiy',
        say: (content: string) => `---${content}---`,
    }

    interface Say {
        (content: string): string;
    }
    interface User_5 {
        readonly id: string;
        name: string;
        age?: number;
        say: Say;
    }

    // 索引类型
    interface Email {
        [name: string]: string;
    }
    interface User_6 {
        readonly id: string;
        name: string;
        age?: number;
        emails: Email;
    }

    const user6_1: User_6 = {
        id: '101',
        name: 'karmiy',
        emails: {
            '163': 'abc@163.com',
            'qq': 'abc@qq.com',
            'yeah': 'abc@yeah.com',
        }
    }
    const user6_2: User_6 = {
        id: '101',
        name: 'karloy',
        emails: {
            'qq': 'bcd@qq.com',
        }
    }

    // 继承
    interface User_7 {
        readonly id: string;
        name: string;
        age?: number;
    }

    interface SubUser extends User_7 {
        readonly parentId: string;
    }

    const subUser: SubUser = {
        id: '10101',
        name: 'zero',
        parentId: '101'
    }
}
// export {};