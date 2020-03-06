## 来源

学习至掘金小册：

- [Vue 开发必须知道的 36 个技巧](https://juejin.im/post/5d9d386fe51d45784d3f8637#heading-6)

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


