## 关于 proxy 双向引用

在了解 vue3 响应式变量相互绑定前，先了解 proxy 引用问题可以帮助更好的理解

对于普通对象，2个对象之间是不会在基础类型的属性值上引用的：

```ts
const obj = {
    id: 1,
    nested: {
        name: 'k',
    }
};

const _obj = {
    ...obj,
};

_obj.id = 10;
_obj.nested.name = 'kk',

console.log(obj.id, _obj.id); // 1 10，基础类型的属性是不会忽然影响的
console.log(obj.nested.name, _obj.nested.name); // kk kk
```

然而 proxy 构建出来的对象却不同，即时是基础类型的属性，也会忽然影响：

```ts
const obj = {
    id: 1,
    nested: {
        name: 'k',
    }
};

const _obj = new Proxy(obj, {});

_obj.id = 10;
_obj.nested.name = 'kk',

console.log(obj.id, _obj.id); // 10 10，基础类型的属性是会互相影响的
console.log(obj.nested.name, _obj.nested.name); // kk kk

obj.id = 100;
obj.nested.name = 'kkk';
console.log(obj.id, _obj.id); // 100 100
console.log(obj.nested.name, _obj.nested.name); // kkk kkk

console.log(obj === _obj); // false
```