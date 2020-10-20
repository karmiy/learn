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

console.log(obj.id, _obj.id);
console.log(obj.nested.name, _obj.nested.name);

obj.id = 100;
obj.nested.name = 'kkk';
console.log(obj.id, _obj.id);
console.log(obj.nested.name, _obj.nested.name);

console.log(obj === _obj);
```