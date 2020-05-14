## 来源

学习至掘金小册：

- [Vue 开发必须知道的 36 个技巧](https://juejin.im/post/5d9d386fe51d45784d3f8637)

- [Vue读懂这篇，进阶高级](https://juejin.im/post/5e2453e8518825366e13f59a)

- [30 道 Vue 面试题](https://juejin.im/post/5d59f2a451882549be53b170)

- [12道vue高频原理面试题,你能答出几道](https://juejin.im/post/5e04411f6fb9a0166049a073)

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

## Vue 的生命周期有哪些

- beforeCreate：组件实例初始化之后，this 指向实例，但访问不了 data、computed、watch、methods，数据也还未响应式。常用于初始化非响应式变量

- created：数据响应式了，可以访问 data、computed、watch、methods 了，但是未挂载 DOM，无法用 this.$el 访问到 DOM 节点，$refs 属性内容也还没有。常用于简单的 ajax 请求

- beforeMount：在挂载开始之前调用，beforeMount前，会找到对应 template，编译成 render 函数

- mounted：实例挂载到 DOM，此时可以访问 this.$el、this.$refs。常用于组件初始化后访问 DOM 节点

- beforeUpdate：响应式数据更新时调用，需要 DOM 打补丁前。常用于更新前访问原有的 DOM

- updated：虚拟 DOM 重新渲染打补丁之后调用，DOM 已更新

- beforeDestroy：组件实例销毁前触发，组件的 data、computed、methods 等还可以访问，this 也能拿到实例。常用于销毁定时器、解绑事件等

- destroyed：实例销毁后触发，实例所有东西都会解绑，子实例也销毁，都访问不到

- activated：在组件被 keep-alive 包裹时，每次进入当前组件时就会触发 activated（第一次也会，在 created 后触发）

- deactivated：在组件被 keep-alive 包裹时，每次离开当前组件时触发 deactivated

- errorCaptured：Vue 2.5.0 新增，捕获一个来自子孙组件的错误时调用

**组件生命周期的执行顺序：**

- 加载渲染：

父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

- 组件更新：

父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

- 销毁：

父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

## 在哪个生命周期调用异步请求

可以在 created、beforeMount、mounted 中调用

因为这 3 个钩子中 data 已创建，可以将服务端返回的数据进行赋值

推荐在 created：

- 可以更快获取服务端数据，减少页面 loading 时间

- SSR 不支持 beforeMount、mounted

## 为什么组件中的 data 是个函数

组件中 data 必须是个函数，而 new Vue 实例里的 data 可以是对象

    // 组件中
    data() {
        return {
            ...
        }
    }

    // new Vue
    new Vue({
        el: '#app',
        data: {
            ...
        }
    })

因为组件是可复用的，JS 里对象是引用关系，如果 data 是对象，作用域没有隔离，组件中的 data 会互相影响，如果是函数，每个实例可以维护一份被返回对象的拷贝，互不影响

new Vue 的实例不会被复用，不存在这个问题

## v-model 原理

v-model 可以在表单 input、textarea、select 等元素上创建双向数据绑定

v-model 本质是语法糖，内部为不同的输入元素使用不同的属性与抛出不同的事件

- text、textarea 元素使用 value 属性、input 事件

- checkbox、radio 使用 checked 属性、change 事件

- select 使用 value 属性、change 事件

例如 input 表单元素：

    <input v-model='inputValue' />

    等价于：
    <input :value='inputValue' @input='inputValue = $event.target.value'>

除了这些，还可以自定义组件中使用 v-model

    // Wrap 组件
    export default {
        props: ['value'],
        model: {
            prop: 'value',
            event: 'change',
        },
        methods: {
            fn() {
                ...
                this.$emit('change', this.currentValue);
            }
        }
    }

    // 父组件
    <Wrap v-model='val' />

    data() {
        return {
            val: '',
        }
    }


## Class 与 Style 如何动态绑定

- class

`````````
// 数组形式
<div :class="[isActive ? 'show' : 'hide', 'wrap']"></div>

data() {
    return {
        isActive: true,
    }
}

// 对象形式
<div :class="{show: isActive, hide: !isActive, wrap: true}"></div>

data() {
    return {
        isActive: true,
    }
}
`````````

- style
`````````
// 数组形式
<div :style="[colorStyle, fontStyle]"></div>

data() {
    return {
        colorStyle: {
            color: 'red',
        },
        fontStyle: {
            fontSize: '16px',
        }
    }
}

// 对象形式
<div :style="{color: 'red', fontSize: '16px'}"></div>

`````````

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
    <header :title='title' @update:title='val => title = val' />

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
        <div>test: {{props.id}} class: {{data.staticClass}} style: {{data.style}} fullName: {{fullName(props.prefix, props.name)}}</div>
    </template>
    export default {
        props: {
            prefix: String,
            name: String,
        },
        fullName(prefix, name) {
            return prefix + '-' + name
        }
    }

> 注：函数式组件不自动继承 class、style，会放到 context.data 下，上面是单文件 .vue 的写法，可以在 render 写法打印查看

    export default {
        render(h, context) {
            console.log(context);

            return h('div', context.data, '1111');
        }
    }

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

## Vue 中 this.$nextTick 的原理

当我们改变数据时，如果在 DOM 更新后进行操作，一般都需要使用 $nextTick：

    <div>name: {{name}}</div>

    data() {
        return {
            name: 'kkk',
        }
    },
    mounted() {
        this.name = '666';
        this.$nextTick(() => {
          console.log(this.$el.innerText); // 输出 name: 666
        });

        console.log(this.$el.innerText); // 输出 name: kkk
    },

这是因为 **JavaScript 的事件循环**

我们知道，所有的同步任务都在主线程上执行，除了主线程外，还存在一个任务队列，异步任务的执行结果会被放到这个队列里等待取出

当主线程的任务执行后，就会去读取任务队列后执行

不断这样循环

而任务又分为宏任务和微任务，主线程里的任务也是一种宏任务，当主线程执行完毕后，会取出任务队列里所有的微任务执行

而后进入下一次事件循环，取出下一个宏任务执行

**Vue 就是利用了这种机制：**

当 Vue 检测到数据变化，触发 watcher 更新操作，就会开启一个队列，而不是立即去更新 DOM，多个 watcher 被多次触发只会被推入队列里一次

Vue 内部对异步队列尝试使用，Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替

也就是说，当我们操作了 this.name = '666' 后，这时会触发 watcher 去更新视图，即更新 DOM，但是 Vue 不会直接同步执行 DOM 的更新，而是会把这个操作放在异步队列里，即将 DOM 的操作放在如上提到的 Promise.then 等其中一个里，这样这个操作 DOM 的代码就不会立即执行

等我们全部同步操作都结束后（我们可能做了许多数据改变，如 this.name = '666'; this.id = 1 ....，与之相关的 update DOM 的操作会一个个用如 Promise.then 置于任务队列中），就会去取这些代码来一一执行，做到 DOM 视图的改变

而 $nextTick 里的回调同样与 update 操作相同，被放到异步队列里，用如 Promise.then 包起来，所以当我们在代码后面利用 this.$next 操作 DOM 时，可以拿到最新的 DOM 视图结果，因为例如是用 Promise.then，那微任务都被取出来了，DOM 的 update 代码在我们 this.$nextTick 之前操作好了，自然 $nextTick 里可以得到最新的视图数据

    <div>name: {{name}}</div>

    data() {
        return {
            name: 'kkk',
        }
    },
    mounted() {
        this.$nextTick(() => {
          console.log(this.$el.innerText); // 输出 name: kkk
        });

        this.name = '666';

        this.$nextTick(() => {
          console.log(this.$el.innerText); // 输出 name: 666
        });
    },

如上，第一个 $nextTick 执行后，回调被用如 Promise.then 包起来放到异步队列里了，接着执行 this.name = '666'，它相关的 DOM update 操作也被放到异步队列里了，最后执行第二个 $nextTick，回调同样被放到异步队列里，取出来时是一个个顺序执行，而 DOM 更新视图是在第二个异步任务里做的，所以第一个 $nextTick 的回调里拿到的还是旧的，第二个 $nextTick 是新视图

此外，除了 $nextTick 的回调是遵循这样异步执行，根据上面说到的 watcher 的更新也是这样异步执行，可知在 computed、watch 中的回调也会是异步执行的

## 如何监听子组件的声明周期钩子

可以通过 @hook:XXX 监听子组件的生命周期钩子：

    // 监听 todo-item 组件的 mounted 钩子
    <todo-item @hook:mounted="childrenMounted" />

    methods: {
        childrenMounted() {
            console.log('监听到子组件 mounted');
        }
    }

## Vue 的数据初始化顺序是什么样的

- inject

- provide

- props

- methods

- data

- computed

- watch

以上按顺序初始化，然后再 created

这个顺序可以得知：

- 初始化时 watch 可以拿到 computed

- data 里不能用 computed 初始化

## 怎么理解 Vue 单向数据流

所有 prop 都使其父子之间形成**单向下行绑定**

父级 prop 的更新会向下流动到子组件，反过来不行

这样可以防止子组件意外改变父组件状态，导致应用打的数据流向难以理解

## 什么是 MVVM

MVVM 源于 MVC

MVC：

- View：UI 界面

- Model：管理数据

- Controller：业务逻辑

当界面 View 收到用户响应时（如输入框输入内容），由 Controller 执行相应的业务逻辑代码通知 Model 变化。View 和 Model 需要通过 Controller 承上启下

但是在这前端开发中存在一些痛处：

- 在代码上大量调用相同 DOM API，处理繁琐冗余

- 大量 DOM 操作使页面渲染性能降低

- Model 频繁变化，开发者需要主动更新到 View，用户操作导致 View 变化，也同样需要开发者同步到 Model，工作繁琐，很难维护复杂多变的数据状态

JQuery 就是为了让开发者可以更简洁的操作 DOM，然而它也只能解决第一个问题


MVVM：

- View：UI 界面

- ViewModel：组织生成和维护的视图数据层

- Model：管理数据

在 MVVM 中，实现了双向绑定，View 和 Model 通过 ViewModel 交互，而 View 与 Model 之间同步的工作，都由 ViewModel 自动去完成

开发者不需要自己去操纵 DOM 更新视图，MVVM 已经把这一块都做好了，只需要处理和维护 ViewModel，更新数据视图就会自动得到响应

View 层展示的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 交互，完全的解耦了 View 与 Model

在 Vue 中，我们在 template 的模板就相当于 MVVM 的 View 层：

    <template>
        <div id='app'>
            <p>{{message}}</p>
        </div>
    </template>

组件中 data 的数据可以算一层 Model 管理层：


    new Vue({
        data() {
            return {
                message: '',
            }
        },
        ...
    })

而整个组件实例就相当于 ViewModel 层：

    // vm 相当于 ViewModel 层，帮助我们管理数据与视图
    const vm = new Vue({
        ...
    })

我们不需要自己去操作 DOM，只需要维护好 vm 里的数据，就会自动帮助我们同步到 View 视图中，而 View 中收到用户的操作响应，也由 vm 帮我们同步到 Model 中

## Vue 是如何实现数据双向绑定

双向绑定主要是：数据变化时更新视图（Data => View），视图变化更新数据（View => Data）

- View => Data

主要通过事件监听来实现

如 input 输入时触发 oninput 事件修改 vm.$data 里的数据

- Data => View

比较复杂的是数据如何同步到视图，而这个原理其实就是 Vue 响应式的原理：

当数据变化时，触发 Observer 的 setter，从而触发 Dep 的 notify 通知全部 Watcher 进行相应的 update 操作更新 DOM，从而更新视图

## Vue 是如何对数组方法进行变异的

Vue 通过原型拦截的方式重新的数据的 7 个方法：

- push

- pop

- shift

- unshift

- splice

- sort

- reverse

当调用数组这些方法时，首先获取数组的 \__ob__，即 Observer 对象，如果有新的值，就调用 observeArray 对新值进行监听，然后手动调用 notify 通知 watcher 执行 update

## vm.$set 的实现原理

对于已创建的实例，Vue 不允许动态添加根级别的响应式属性：

    data() {
        return {
            info: {
                id: 1,
                name: 'k',
            }
        }
    },
    mounted() {
        this.info.code = '0393'; // 无效，code 不会是响应式的
    },

Vue 提供了 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式属性：

    data() {
        return {
            info: {
                id: 1,
                name: 'k',
            }
        }
    },
    mounted() {
        this.$set(this.info, 'code', '0393'); // code 会成为响应式的
    },

那么 Vue 内部是如何解决对象新增属性不能响应式的问题？

Vue.set 做了如下操作：

- 如果目标是数组，使用 Vue 变异过的 splice 实现响应式（Array.prototype.splice 在原型上被 Vue 拦截了）

- 如果目标是对象，判断属性是否存在，存在的话那本身这个属性已经是响应式，直接赋值即可

- 如果目标本身就不是响应式的（Vue 中被响应式过的对象会添加自定义属性 \__ob__），那直接赋值，不把这个目标对象响应式化

- 如果目标是响应式对象，属性不是响应式的，调用 defineReactive 进行响应式处理

## Vue 中 Directive 有什么作用

自定义指令

当我们需要对 DOM 进行底层操作时，可以使用自定义指令来完成

我们希望 input 元素在页面初始化时可以聚焦，我们可能会在 mounted 生命周期中获取 input 元素后 .focus() 达到聚焦效果

而 Vue 更推崇的是 MVVM 模式，我们不应该手动去操作 DOM 元素，可以把对 DOM 的操作封装为一个指令，做到抽离解耦，而且提升了复用性：

    // 全局注册
    Vue.directive('focus', {
        inserted(el) {
            el.focus();
        }
    });

    // 组件中
    <input v-focus />

    // 组件中局部注册
    directives：{
        'focus':{
            inserted: function(el){
                el.focus();
            }
        }
    }


除了上面的 inserted，还有如下**钩子函数**：

- bind：只调用一次，指令第一次绑定到元素时调用，可以在这里进行一次初始化设置。注：这里可以拿到 el 元素，但是 el 的父元素是 null 还拿不到

- inserted：被插入到父节点调用，这里 el 的父元素不再是 null，可以拿到父元素，但是不一定被插入到 document

- update：所有组件 VNode 更新时调用，但可能在子 VNode 更新前。指令的值不一定会发生变化，可以通过对比防止不必要的操作

- componentUpdated：所有组件 VNode 及子 VNode 全部更新后调用

- unbind：只调用一次，指令与元素解绑时调用

如上的钩子函数，会接收如下**参数**：

- el：绑定的元素，可以用来操作 DOM

- binding：对象，包含一些属性：

    - name：指令名，不包含 v- 前缀

    - value：指令绑定值，如 v-test="10"，value 为 10

    - oldValue：绑定前一个值，在 update 和 componentUpdated 中做对比

    - expression：指令表达式，如 v-test="1 + 1"，表达式为 "1 + 1"

    - arg：传给指令的参数，如 v-test:foo，参数为 foo

    - modifiers：修饰符对象，如 v-test:foo.bar，修饰符对象为 { foo: true, bar: true }

- vnode：Vue 编译生成的虚拟节点

- oldVnode：上一个虚拟节点，在 update 和 componentUpdated 中做对比

还可以有**动态指令参数**：

    // 组件中
    <div v-test:[direction]="200">...</div>
    
    data() {
        return {
            direction: 'left'
        }
    }

    Vue.directive('test', {
        bind: function (el, binding, vnode) {
            const d = binding.arg == 'left' ? 'left': 'top';
        }
    })

**当 bind 和 update 做相同行为时，不关心其他钩子，可以简写**：

    Vue.directive('color', function (el, binding) {
        el.style.color = binding.value;
    })

## Vue 有哪些性能优化

- 高频率切换使用 v-show，而不是用 v-if

- 区分 computed、watch 应用场景

- 少直接在面板上做 JS 表达式操作，如 v-if="isShow && isWrap && (x || y)"，可以写到 computed、methods 中

- v-if 循环节点时使用 key 表示

- 不用使用 v-for 又 v-if，v-for 优先级高，可以使用 computed 代替过滤

- 组件分割，如未使用的组件使用异步组件进行按需加载

- 路由懒加载

- 打包时如 axios 等不一起打包，可以使用 cdn 链接引入于 index.html

- SSR 服务端渲染，减少首屏加载执行 JS 的时间

- Object.freeze 冻结不需要响应式化的资源

- 事件记得在组件销毁时取消监听

## Vue 有哪些隐藏操作

在 Vue 实例上有 $el 获取根节点 DOM，与之对应有个隐藏属性，DOM 节点上会挂载 \_\_vue\_\_ 属性反向得到 Vue 实例

如组件：

    <template>
        <div id='k'>
            ...
        </div>
    </template>

我们可以通过如下操作拿到这个组件的 Vue 实例：

    document.getElementById('k').__vue__