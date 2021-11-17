# Node 帮助文档

## path

路径解析

- path.resolve：解析路径，以脚本调用位置为基点，可用于 cli 搭建时解析项目根目录文件

- path.join：合并路径

- path.basename：获取文件名，第二个参数代表需要移除的后缀

```ts
path.basename('E://xxxx/a.svg'); // a.svg
path.basename('E://xxxx/a.svg', '.svg'); // a
```

## fs

文件

- unlinkSync：同步删除文件

```ts
fs.unlinkSync('./a.ts');
```

- copyFileSync：同步复制文件

```ts
fs.copyFileSync(
    path.join(__dirname, `./a.ts`),
    './lib/a.ts',
);
```

## mkdirp

创建文件夹

- sync：同步创建文件夹，有则不建

```ts
mkdirp.sync('./k');
```

## glob

通配符

- sync：同步获取文件夹下的文件

```ts
glob.sync(path.join(saveDir, '*'));
glob.sync('./**/*.tif');
```