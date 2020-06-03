## 基础

- 不同浏览器盒模型不同，能不能讲下 box-sizing 有哪些类型，什么区别

- 行内元素和块级元素上下左右 margin padding 有效吗，哪些无效

- CSS 优先级，伪类和 class 优先级谁高

- 做 banner 时要用 background-size 放置轮播图，它有哪些属性，100% 100% 会是什么效果，contain 和 cover 有什么差

- z-index 有什么用，z-index 大的一定层级高吗，有没有什么情况 z-index 大的反而在下面

- 能不能讲下原型，构造函数和对象实例怎么获取到原型

- 能不能讲下 ES5 继承，内部属性怎么继承，原型属性怎么继承

- 能不能讲下事件循环

- 能不能讲下事件代理，为什么要事件代理

- bind、apply、call 有什么区别，谁会立即执行谁不会，bind 2 次，this 指向是第 1 次还是第 2 次

- JS 哪些数据在 if 下判定是 false

- JS 有哪些数据类型，symbol 解决了什么，bigint 解决了什么，bigint 可以和 number 计算吗

- async 函数和普通函数有什么区别，怎么做错误捕获

- 可以讲一下 this 指向吗

- splice 和 slice 是做什么的，谁会改变原数组

- 能不能讲下深拷贝和浅拷贝区别，怎么实现深拷贝，需要考虑哪些

- 防抖和节流有什么区别

- 怎么理解闭包，有什么作用

- JS 会阻塞页面加载吗，CSS 加载会阻塞 DOM 解析吗，CSS 会阻塞 render 树吗，JS 会阻塞 DOM 解析吗，CSS 会阻塞 JS 执行吗

- 能不能讲下前端有哪些性能优化

## Webpack

- webpack 是怎么做打包的，什么原理

- import 互相依赖会怎么样，a 引入 b，b 引入 c，c 引入 a，会发生什么，会报错吗，webpack 会做处理吗

- 搭建一个 webpack 架构需要考虑哪些

- 引入类似 jquery、moment.js、lodash 这种库合适吗，会造成什么问题

## 组件库

- 你做过组件库吗

- 做一个 tab 选项卡组件你会考虑什么

- 封装组件后要发布到 npm 需要考虑什么

## Vue

- watch 怎么做深度监听，怎么立即执行

- 生命周期有哪些，beforeCreate 可以拿到 data、methods 之类的吗，created 呢

- 请求放在哪个生命周期，DOM 操作呢

- MVVM 是什么，和 MVC 它有什么特点

- 父组件的 beforeCreate、created、beforeMount、mounted 和子组件的 beforeCreate、created、beforeMount、mounted，这 8 个钩子执行顺序

- Vue 响应式原理

- v-model 原理，自定义组件怎么使用 v-model

- 希望多个 v-model 这种双向绑定效果，但是 Vue 只能有一个 v-model，怎么解决

- 组件有哪些通讯方式

- vuex 有什么用，什么情况下用，仅仅通讯不方便使用 vuex 合适吗

- 能不能讲下插槽，作用域插槽，有什么作用

- $attrs 和 $listeners 会接收哪些属性，在开发组件库时什么情况下会用到

- keep-alive 作用是什么，切换回原页面后想触发请求怎么实现

- 递归组件有什么应用场景

- components 和 Vue.component 有什么区别

- Vue.extend 有什么作用，什么场景会使用

- Vue.use 有什么用，它的原理是什么

- data 中数据会被包装进行响应式监听，如何让 data 中不需要响应式的数据做到非响应式化

- computed、watch 的应用场景

- Vue 中 key 有什么用，不用 key 可能会造成什么问题

- this.$nextTick 原理

- 能不能讲下指令 Directive，什么时候会封装指令

- 怎么通过组件根元素的 DOM 获取 Vue 组件示例

- Vue 层面有哪些性能优化方向