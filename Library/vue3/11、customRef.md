## customRef

自定义 ref，接受一个工厂函数，接收 track（追踪依赖）与 trigger（触发响应），返回带有 get, set 的对象：

```ts
customRef((track, trigger) => {
    return {
        get() {},
        set() {},
    }
});
```

customRef 的好处在于：

- 可以显示的控制依赖跟踪与触发响应

- 更灵活的控制 ref 值的获取与更新

