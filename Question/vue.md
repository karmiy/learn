## 来源

学习至掘金小册：

- [Vue 开发必须知道的 36 个技巧](https://juejin.im/post/5d9d386fe51d45784d3f8637#heading-6)

- [Vue读懂这篇，进阶高级](https://juejin.im/post/5e2453e8518825366e13f59a)

## Watch 如何实现立即执行

一般 watch 在组件初始化时是不会立即执行的：

    data() {
        return {
            value: '',
        }
    },
    watch: {
        value() {
            ...
        }
    }

可以配置 immediate 让 watch 在组件初始化时立即执行：

    watch: {
        value: {
            immediate: true,
            handler() {
                ...
            }
        }
    }

## Watch 如何实现深度监听

当 watch 监听的是对象，属性值里有更深层次的对象发生变化时，watch 是监听不到的

可以配置 deep 实现深度监听：

    watch: {
        value: {
            deep: true,
            handler() {
                ...
            }
        }
    }

## 组件之间有哪些通讯方式

- prop

父 => 子

    props: ['value'],

    或

    props: {
        value: {
            type: String,
            required: true,
            default: '',
            validator(v) {
                return ['success', 'warning'].indexOf(value) !== -1;
            }
        }
    }

- $emit

子 => 父

    // 父
    <header @titleChange="titleChange" />

    // 子
    this.$emit('titleChange', 'new title');

- vuex

全局组件数据共享

- $attrs、$listeners

$attrs 获取父组件传递下来的属性中，不在 props 中的项（也除了 class 和 style）：

    // 父
    <header title='title' width='80' height='80' />

    // 子
    props: [],
    mounted() {
        // {title: 'title', width: '80', height: '80'}
        console.log(this.$attrs);
    }

还可以使用 v-bind="$attrs" 继续让下传递给子子组件

> 注：一般会将 inheritAttrs 设为 false，让未被 props 注册的属性不渲染为子组件根元素的属性

$listeners 为父组件传递的方法：

    // 父
    <header @titleChange="titleChange" />

    // 子
    mounted() {
        // 里面有 titleChange 方法
        console.log(this.$listeners);
    }

- provide、inject

跨级的父 => 子(子)

    // 父
    provide: {
        value: 'something',
        valueChange: v => console.log(v),
    }

    // 子(子)
    inject: ['value', 'valueChange'],
    mounted() {
        this.value;
        this.valueChange('anything');
    }

> 注：provide 和 inject 绑定并不是可响应的，如果需要响应，需要传入可监听对象

    // 父
    data() {
        return {
            user: {id: 1}
        }
    },
    provide() {
        return {
            user: this.user,
        }
    },
    mounted() {
        this.user.id = '2';
    },

    // 子
    inject: ['user'],
    mounted() {
        console.log(this.user.id);
    },

- $parent、$children

$children 获取子组件的实例，是个数组

$parent 获取父组件实例

- $refs

获取子组件实例或 DOM 节点

    <header ref='header' />

    mounted() {
        this.$refs.header; // header 组件实例
    }

- $root

获取根组件实例，一般是 main.js 里 new Vue 的那个实例

- .sync

双向绑定的功能

    // 父
    <header :title.sync='titie' />

    等价于
    <header :title='title' @update='val => title = val' />

    // 子
    mounted() {
        this.$emit('update:title', 'new title');
    }

- v-slot

默认插槽：

    // 父
    <todo-list>
        <template v-slot:default>
            <p>内容</p>
        </template>
    </todo-list>

    // 子
    <slot>默认内容</slot>

具名插槽：

    // 父
    <todo-list>
        <template v-slot:todo>
            <p>内容</p>
        </template>
    </todo-list>

    // 子
    <slot name='todo'>默认内容</slot>

作用域插槽：

    // 父
    <todo-list>
        <template v-slot:todo='scope'>
            <p>{{scope.name}}</p>
        </template>
    </todo-list>

    // 子
    <slot name='todo' :name='name'>{{name}}</slot>

    data() {
        return {
            name: 'k',
        }
    }

- EventBus

利用 on 和 emit 传递与接收事件，实例化一个全局 vue 实例实现数据共享

    // main.js
    Vue.prototype.$eventBus = new Vue();

    // 组件 A
    this.$eventBus.$emit('targetChange', 'something');

    // 组件 B
    this.$eventBus.$on('targetChange', v => {
        console.log(v);
    })

- 路由传参

组件页面之间通过路由传参也算是一种通讯方式：

示例一：

    // 组件 A
    this.$router.push({
        path: '/b/${this.id}',
    })

    或
    this.$router.push({
        name: 'B',
        params: {
            id: this,id,
        }
    })

    // 组件 B
    this.$route.params.id

示例二：

    // 组件 A
    this.$router.push({
        path: '/b',
        query: {
            id: this.id,
        }
    })

    // 组件 B
    this.$route.query.id

- Vue.observable

2.6.0 新增，让一个对象可响应，相当于一个简易版 vuex

    // store.js
    export const store = Vue.observable({
        name: 'observable instance',
    })

    // 组件 A
    import store from '../store';

    <div>{{name}}</div>

    computed: {
        name() {
            return store.name;
        },
    },

- broadcast、dispatch

vue 1.x 时的方法，事件广播与派发，vue 2.x 删除了

broadcast 用于父传子（可跨级）

dispatch 用于子（可跨级）传父

**broadcast 实现：**

    // 实现
    function broadcast(componentName, eventName, params) {
        this.$children.forEach(child => {
            const name = child.$options.name;
            if (name === componentName) {
                child.$emit.apply(child, [eventName].concat(params));
            } else {
                broadcast.apply(child, [componentName, eventName].concat([params]));
            }
        });
    }

    // 父组件 App.vue
    mounted() {
        broadcast.call(this, 'Test', 'app-loaded', 100);
    },

    // 子组件 Test.vue
    mounted() {
        this.$on('app-loaded', (a) => {
            console.log(a); // 输出 100
        })
    }

**dispatch 的实现：**

    // 实现
    function dispatch(componentName, eventName, params) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;
        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;
            if (parent) name = parent.$options.name;
        }
        if (parent) parent.$emit.apply(parent, [eventName].concat(params));
    }

    // 子组件 Test.vue
    mounted() {
        dispatch.call(this, 'App', 'test-loaded', 10);
    }

    // 父组件 App.vue
    created() {
        this.$on('test-loaded', a => {
            console.log(a); // 输出 10
        })
    }

## 如何获取父/子/兄弟组件实例

- findComponentUpward

向上匹配最近 componentName 的组件实例

    // 实现
    export const findComponentUpward = (context, componentName, componentNames) => {
        let parent = context.$parent;
        let name = parent.$options.name;
        while (parent && (!name || componentName !== name)) {
            parent = parent.$parent;
            if (parent) name = parent.$options.name;
        }
        return parent;
    };

    // 子组件 Test.vue，查找上级 App 组件实例
    mounted() {
        console.log(findComponentUpward(this, 'App'));
    }

- findComponentsUpward

向上匹配所有 componentName 的组件实例

    // 实现
    export const findComponentsUpward = (context, componentName) => {
        let parents = [];
        const parent = context.$parent;
        if (parent) {
            if (parent.$options.name === componentName) parents.push(parent);
            return parents.concat(findComponentsUpward(parent, componentName));
        } else {
            return [];
        }
    };

    // 子组件 Test.vue，查找上级 App 组件实例
    mounted() {
        console.log(findComponentsUpward(this, 'App'));
    }

- findComponentDownward

向下匹配最近 componentName 的组件实例

    // 实现
    export const findComponentDownward = (context, componentName) => {
        const childrenList = context.$children;
        let children = null;
        if (childrenList.length) {
            for (const child of childrenList) {
                const name = child.$options.name;
                if (name === componentName) {
                    children = child;
                    break;
                } else {
                    children = findComponentDownward(child, componentName);
                    if (children) break;
                }
            }
        }
        return children;
    };

    // 父组件 App.vue，查找下级 Test 组件实例
    mounted() {
        console.log(findComponentDownward(this, 'Test'));
    }

- findComponentsDownward

向下匹配所有 componentName 的组件实例

    // 实现
    export const findComponentsDownward = (context, componentName) => {
        return context.$children.reduce((components, child) => {
            if (child.$options.name === componentName) components.push(child);
            const foundChilds = findComponentsDownward(child, componentName);
            return components.concat(foundChilds);
        }, []);
    };

    // 父组件 App.vue，查找下级 Test 组件实例
    mounted() {
        console.log(findComponentsDownward(this, 'Test'));
    }

- findBrothersComponents

查找匹配 componentName 的兄弟组件实例

    // 实现
    export const findBrothersComponents = (context, componentName, excludeSelf = true) => {
        let res = context.$parent.$children.filter(item => {
            return item.$options.name === componentName;
        });
        let index = res.findIndex(item => item._uid === context._uid);
        if (excludeSelf && index !== -1) res.splice(index, 1);
        return res;
    };

    // 子组件 Test.vue，查找兄弟 Wrap 组件实例
    mounted() {
        console.log(findBrothersComponents(this, "Wrap"));
    }

## 如何实现异步组件

项目过大会导致加载缓慢，异步组件实现了按需加载

常规注册组件：

    Vue.component('km-button', KmButton);

注册异步组件

    // 全局注册：
    // 方式一
    Vue.component('km-button', function(resolve) {
        require(['./components/km-button'], resolve);
    })

    // 方式二
    Vue.component(
        'km-button', 
        () => import('./components/km-button')
    )

    // 方式三
    const KmButton = () => ({
        component: import('./components/km-button'),
        // 异步组件加载时使用的组件
        loading: LoadingComponent,
        // 加载失败时使用的组件
        error: ErrorComponent,
        // 展示加载时组件的延时时间。默认值是 200 (毫秒)
        delay: 200,
        // 如果提供了超时时间且组件加载也超时了，
        // 则使用加载失败时使用的组件。默认值是：`Infinity`
        timeout: 3000
    })

    Vue.component('km-button', KmButton)

    // 局部注册
    组件 A：
    components: {
        KmButton: () => import('./components/km-button'),
    }

## 什么是动态组件

Vue 提供了特殊的 \<component> 元素让我们动态的挂载不同的组件：

    // 组件 A
    <component :is="currentComponent" />

    import Test from './components/test';
    data() {
        return {
            currentComponent: 'Test',
        }
    },
    components: {
        Test,
    },

    或
    <component :is="currentComponent" />

    import Test from './components/test';
    data() {
        return {
            currentComponent: Test,
        }
    },

## 什么是 keep-alive

在动态组件中，每次组件的切换都会导致组件重新加载

keep-alive 可以让组件实例得到缓存，在重新切换到原来的组件时不会重新加载组件：

    <keep-alive>
        <component :is="currentComponent" />
    </keep-alive>

keep-alive 可以使用 include 与 exclude 包含与排除，因为有些组件可能需要有实时性，那就不能缓存，可以使用 exclude 排除：

    <keep-alive :include="['a', 'b']">
        // 或include="a,b" :include="/a|b/",a 和 b 表示组件的 name
        <router-view/>
    </keep-alive>

    <keep-alive :exclude="c">
        <router-view/>
    </keep-alive>

## 什么是递归组件

    // Tree 组件
    <Treelayer :list='list'>

    data() {
        return {
            list: [
                {
                    id: 1,
                    children: [
                        {
                            id: 11
                        }
                    ]
                },
                {
                    id: 2,
                }
            ]
        }
    }

    // TreeLayer 递归组件
    <ul class='menu_tree_layer'>
        <li v-for='item in list'>
            <p>id: {{item.id}}</p>
            <tree-layer v-if='item.children' :list='item.children' />
        </li>
    </ul>

    name: "Treelayer", // 必须定义 name 组件内部才可以递归
    prop: {
        list: {
            type: Array,
            default: [],
        }
    }

## 什么是函数式组件

内部无状态，无法实例化，没有任何生命周期的组件

通常纯 UI 组件可以定义为函数组件，性能更好

函数式组件一切通过 context 参数传递

context 参数上有：

- props：提供所有 prop 的对象

- children：VNode 子节点的数组 

- slots：一个函数，返回了包含所有插槽的对象

- scopedSlots：一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽

- data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件

- parent：对父组件的引用

- listeners：一个包含了所有父组件为当前组件注册的事件监听器的对象。这是 data.on 的一个别名

- injections：如果使用了 inject 选项，则该对象包含了应当被注入的属性

使用：

    <template functional>
        <div>test: {{props.id}}</div>
    </template>

## components 和 Vue.component 的区别

components 在组件内部使用，是**局部注册**，只在当前组件内注册和使用

    // 组件 A
    <div>
        <B />
    </div>

    import B from './B';
    components: {
        B,
    }

Vue.component 是**全局注册**，注册后全局任何组件都可以使用，一般在使用第三方组件库时，就会全局组件某个组件：

    // main.js
    Vue.component('km-button', KmButton);


    // 组件 A
    <div>
        <km-button />
    </div>

    不需要 components 里再放 KmButton 了

## Vue.component 和 Vue.extend 的区别

Vue.component 上个问题中提过，是**全局注册组件**

Vue.extend 是 Vue 的组件实例构造器，用于创建一个组件实例，通常用于创建实例后，挂载于某个 DOM 元素上

    import Test from './components/test';

    const extend = Vue.extend(Test);
    或
    const extend = Vue.extend({
        template: '<p>value: {{value}}; id: {{id}}</p>',
        data() {
            return {
                id: '1',
            }
        },
        props: ['value'],
    }); 

    // 挂载到 <div id='tood' /> 元素上，会直接覆盖这个 div
    new extend({
        propsData: {
            value: '2222'
        }
    }).$mount('#todo');

## 什么是 Vue.use

Vue.use 通常用于我们使用第三方库的时候注册组件，接收一个对象

Vue.use 会调用对象的 install 方法，install 可以接收一个 Vue 参数

    // 第三方库的 button/index.js
    import Button from './button.vue';

    Button.install = function(Vue) {
        Vue.component(Button.name, Button);
    }

    // 第三方库的 index.js
    import Button from './components/button';
    import Row from './components/row';
    ...

    const components = [
        Button,
        Row,
        ...
    ]

    const install = Vue => {
        components.map(component => Vue.component);
    }

    export default {
        install,
    }


    // 我们的 main.js
    import Vue from 'vue';
    import KmUI from 'kealm-vue-components';

    Vue.use(KmUI); // 这时会去调用 install 方法，并把 Vue 作为参数传给它

## Vue 路由守卫有哪些

### 全局守卫

参数：

- to: 即将进入的目标路由对象 Route

- from：当前导航正要离开的路由对象 Route

- next：函数，一定要调用 next 方法才能 resolve 这个钩子，否则无法进入下一步

    - next()：进入管道下一个钩子，若钩子全部执行完，则导航状态为 comfirmed 可正常进去下一个页面

    - next(false)：中断当前导航

    - next(/) 或 next({path: '/'})：跳转到一个不同的地址。当前导航被中断，进行一个新导航，且允许设置注入 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项

    - next(error)：如果传入的是 Error 示例，导航终止且错误被传递给 router.onError 注册过的回调

**router.beforeEach：**

在渲染该组件的对应路由被确认前调用

    // router.js
    const router = new VueRouter({ ... })

    router.beforeEach((to, from, next) => {
        // ...
        next(); // 要调用 next 才能成功路由跳转
    })

**router.beforeResolve：**

与 beforeEach 类似，区别是在导航被确认前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用

**router.afterEach：**

在所有路由跳转结束的时候调用，不需要 next

    router.afterEach((to, from) => {
        // ...
    })

## 路由内部守卫

    const router = new VueRouter({
        routes: [
            {
                path: '/foo',
                component: Foo,
                beforeEnter: (to, from, next) => {
                    // ...
                }
            }
        ]
    })

这些守卫与全局前置守卫的方法参数是一样的

## 组件内部守卫

    const Foo = {
        template: `...`,
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            // 虽然不能访问 this，但可以给 next 一个回调来接收组件实例，在导航被确认时执行回调
            next(vm => {
                // 通过 `vm` 访问组件实例
            })

        },
        beforeRouteUpdate (to, from, next) {
            // 在当前路由改变，但是该组件被复用时调用
            // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
            // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
            // 可以访问组件实例 `this`
            // next 不需要传参数
            next();
        },
        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            // 可以通过 next(false) 取消
            const answer = window.confirm('...')
            if (answer) {
                next()
            } else {
                next(false)
            }
        }
    }

## Object.freeze 在 Vue 中有什么作用

我们在 Vue 中定义的 data，会被做响应式处理，添加 getter、setter 转换

当使用 Object.freeze 来定义时，Vue 将不会在进行响应式处理，从而提高性能

通常用于不需要改变，仅用于展示或使用的数据：

    data() {
        return {
            list: Object.freeze([
                {id: 1, value: '10'},
                {id: 2, value: '20'}
            ])
        }
    }

## 谈谈 Vue 的响应式原理

Vue 响应式的实现核心在于 3 个类：

- Observer：给对象添加 getter、setter，用于依赖收集与派发更新

- Dep：用于收集响应式对象的依赖关系，每个响应式对象都有一个 Dep 实例，如果响应式对象的属性值也是对象（即有子对象），则这个子对象也会有一个 Dep 实例，当数据变化时，dep 会调用 notify 通知各个 watcher

- Watcher：观察者对象，实例分为渲染 watcher（render watcher）、计算属性 watcher（computed watcher）、侦听器 watcher（user watcher）

流程：

组件会创建一个 Observer 对象，Observer 对组件的 data 使用 Object.defineProperty 对每一个属性值进行监听，并把生成的 Observer 实例放在 data 下的 \__ob__ 属性下

如：

    data() {
        return {
            name: 'k',
        }
    }

会得到：

    {
        name: 'k',
        __ob__: Observer
    }

Observer 里有一个 dep 属性，它是 Dep 的实例,Dep 实例有一个 subs 属性，用于存放 Watcher：

    // Observer 实例
    {
        dep: Dep
    }

    // Dep 实例
    {
        subs: [....] // 里面是 Watcher
    }

我们的 computed watch 等会有相应的 Watcher 实例，当创建了一个 Watcher 时，这个 Watcher 依赖 data 的 name 属性，就会触发 Observer 为其绑定的 getter，将整个 Watcher 实例放到 Dep 的 subs 数组里，并且 Watcher 实例里也会存有对应的 Dep 实例。这样 Observer 的 Dep 实例中，就可以通过 subs 得到全部的 Watcher

当我们会 data 属性赋值时，会触发 Observer 为该属性绑定的 setter，它将触发 Dep 的 notify 方法通知全部 Watcher，而 notify 方法里会遍历 subs 数组，取出 Watcher 做相应的 update 操作

## computed 和 watch 的区别

computed 计算属性，依赖于其他属性值，且值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 值时才会重新计算 computed 的值

watch 侦听器：更多的是观察，无缓存性，类似于某些数据的监听回调

应用场景：

当我们需要进行数值计算，并依赖其他数据时，应该使用 computed，利用它的缓存特性，避免每次获取值时都重新计算

当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch

## Vue 中 key 的作用是什么

key 可以给每一个 vnode 唯一的 id，可以让 diff 操作更准确，更快速

更准确：如果不带 key，相同的节点会采用就地复用的形式，这可能会延伸出一些问题，如绑定的事件触发结果问题，没有过渡动画等问题。加了 key，可以避免就地复用

更快速：key 的唯一性可以被 Map 数据结构充分利用，相比遍历查找时间复杂度 O(n)，有了 key 后 Map 的时间复杂度为 O(1)


