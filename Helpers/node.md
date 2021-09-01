## path

- path.resolve:：解析路径，以脚本调用位置为基点，可用于 cli 搭建时解析项目根目录文件

- path.join：合并路径

- path.basename：获取文件名，第二个参数代表需要移除的后缀

```ts
path.basename('E://xxxx/a.svg'); // a.svg
path.basename('E://xxxx/a.svg', '.svg'); // a
```