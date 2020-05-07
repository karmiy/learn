class Folder {
    constructor(name) {
        this.name = name;
        this.parent = null;
        this.files = [];
    }
    add(file) {
        file.parent = this;
        this.files.push(file);
    }
    scan() {
        console.log(`开始扫描文件夹：${this.name}`);
        this.files.forEach(file => file.scan());
    }
    remove() {
        if(!this.parent) return;

        const files = this.parent.files;
        for(let l = files.length - 1; l >= 0; l--) {
            const file = files[l];
            if(file === this) files.splice(l, 1);
        }
    }
}

class File {
    constructor(name) {
        this.name = name;
        this.parent = null;
    }
    add() {
        throw new Error('文件下不能添加文件');
    }
    scan() {
        console.log(`开始扫描文件：${this.name}`);
    }
    remove() {
        if(!this.parent) return;

        const files = this.parent.files;
        for(let l = files.length - 1; l >= 0; l--) {
            const file = files[l];
            if(file === this) files.splice(l, 1);
        }
    }
}

const folder = new Folder('学习资料');
const folder1 = new Folder('JavaScript');
const folder2 = new Folder('Vue');

const file1 = new File('JavaScript 设计模式与开发实践');
const file2 = new File('Vue 入门到精通');
const file3 = new File('算法与数据结构');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

// 删除 JavaScript 文件夹
folder1.remove();

folder.scan();