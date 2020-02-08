## TypeScript 与 Vue

### 安装 Vue Cli

这里为了快速初始化项目，首选 Vue 官网的 Cli

全局安装：

    npm install -g @vue/cli

安装后查看版本：

    vue -V

### 创建项目

命令行或图形化初始化项目：

    // 命令行
    vue create demo-vue

    // 图形化
    vue ui

下面是图形化的配置：

![Alt text](imgs/25-01.png)

![Alt text](imgs/25-02.png)

![Alt text](imgs/25-03.png)

![Alt text](imgs/25-04.png)

![Alt text](imgs/25-05.png)

![Alt text](imgs/25-06.png)

### 引入第三方库

一般在开发项目中，会用到内部或第三方组件库来完成开发

这里引入移动端 UI 库 Vant：

    npm i vant -S

全组件库引入：

    // src/main.ts
    import Vant from 'vant';
    import 'vant/lib/index.css';
    Vue.use(Vant);

然而我们一般不会这样做，这会导致所有的代码都会打包进来，十分影响打包体积与性能。我们更多的是按需引入，如引入 Button：

    import { Button } from 'vant';
    import 'vant/lib/button/style';
    Vue.use(Button);

当然，这样的编写方式可能比较繁琐，每次使用新的组件都需要这样手动引入样式

JavaScript 中可以利用 babel-plugin-import 插件自动帮我们按需引入

TypeScript 中可以利用 ts-import-plugin 插件帮助我们按需引入：

    npm i -D ts-import-plugin

根目录下 vue.config.js：

    const merge = require("webpack-merge");
    const tsImportPluginFactory = require("ts-import-plugin");

    module.exports = {
        lintOnSave: true,
        chainWebpack: config => {
            config.module
            .rule("ts")
            .use("ts-loader")
            .tap(options => {
                options = merge(options, {
                transpileOnly: true,
                getCustomTransformers: () => ({
                    before: [
                        tsImportPluginFactory({
                            libraryName: "vant",
                            libraryDirectory: "es",
                            style: true
                        })
                    ]
                }),
                compilerOptions: {
                    module: "es2015"
                }
                });
                return options;
            });
        }
    };

使用如下，不需要再次引入样式：

    // src/main.ts
    import { Button } from 'vant';
    Vue.use(Button);

    // src/App.vue
    <van-button type="default">默认按钮</van-button>

随后执行 **npm run serve** 启动项目即可

### vue-property-decorator

与 JavaScript 版的 vue 最大的不同在于引入了 **vue-property-decorator**

由于它的存在，我们可以使用基于类的注解装饰器进行开发，这是目前 ts + vue 的主流

除了vue-property-decorator 外，还有另一个库 **vue-class-component**，它是官方推出的一个支持使用 class 方式开发 vue 单文件组件的库

而 vue-property-decorator 正是基于此基础增加了装饰器功能，它同时拥有 vue-class-component 的功能

#### 主要功能

vue-class-component 功能：

- methods 可以直接声明为类的成员方法

- computed 计算属性可以被声明为类的属性访问器（getter、setter）

- 初始化的 data 可以被声明为类属性

- data、render 及所有 Vue 生命周期钩子可以作为类成员方法

- 所有其他属性，需要放在装饰器中


vue-property-decorator 主要提供多个装饰器和一个函数：

- @Prop

- @PropSync

- @Model

- @Watch

- @Provide

- @Inject

- @ProvideReactive

- @InjectReactive

- @Emit

- @Ref

- @Component (由 vue-class-component 提供)

- Mixins (由 vue-class-component 提供)

### vue-class-component 主要功能

#### @Component

Component 装饰器注明了此类为一个 Vue 组件，即使没有设置选项也不能省略

如果定义了如 name、components、filters、directives 及自定义属性，可以在 Component 装饰器中定义

示例：

    // JavaScript 中
    import { componentA, componentB } from '@/components';

    export default{
        components: {
            componentA,
            componentB,
        },
        directives: {
            focus: {
                // 指令的定义
                inserted: function (el) {
                    el.focus()
                }
            }
        }
    }

    // TypeScript 中
    import { Component, Vue } from 'vue-property-decorator';
    import { componentA, componentB } from '@/components';

    @Component({
        components: {
            componentA,
            componentB,
        },
        directives: {
            focus: {
                // 指令的定义
                inserted: function (el) {
                    el.focus()
                }
            }
        }
    })
    export default class YourCompoent extends Vue{
    
    }

#### Computed、Data、Methods

    // <template>
    <p>{{count}}</p>
    <p>{{total}}</p>
    <van-button type="default" @click="add">+</van-button>

    // <script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class HelloWorld extends Vue {
        count: number = 123; // data
        add(): void { // methods
            this.count += 1;
        }

        get total() { // computed
            return this.count + 10;
        }

        set total(v: number) { // computed
            this.count = v;
        }
    }

### vue-property-decorator 主要 API

#### @Prop

属性相关的修饰器，@Prop(options: (PropOptions | Constructor[] | Constructor) = {})

如果我们打开了 tsconfig.json 的 strictpropertyinitialize，则需要通过附加 ! 给定义的属性来赋值断言

示例：

    // JavaScript 中
    export default{
        props: {
            propA: String,
            propB: [String,Number],
            propC: {
                type: Array,
                default: () => ['a','b'], // 数组与对象需要以函数返回
                required: true,
                validator: (value) => ['a', 'b'].indexOf(value) !== -1
            }   
        }
    }

    // TypeScript 中
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class HelloWorld extends Vue {
        @Prop(String)
        propA!: string;

        @Prop([String, Number])
        propB!: string | number;

        @Prop({
            type: Array,
            default: () => ['a', 'b'],
            required: true,
            validator: value => ['a', 'b'].indexOf(value) !== -1,
        })
        PropC!: Array<string>;
    }

#### @Watch

Vue 中的监听器

示例：

    // JavaScript 中
    export default {
        watch: {
            child: [
                {
                    handler: 'onChildChanged',
                    immediate: false,
                    deep: false,
                }
            ],
            person: [
                {
                    handler: 'onPersonChanged1',
                    immediate: true,
                    deep: true,
                },
                {
                    handler: 'onPersonChanged2',
                    immediate: false,
                    deep: false,
                }
            ]
        },
        methods: {
            onChildChanged(val, oldVal) {},
            onPersonChanged1(val, oldVal) {},
            onPersonChanged2(val, oldVal) {}
        }
    }

    // TypeScript 中
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    interface Person {
        id: number;
        name: string;
        children?: Person[];
    }

    @Component
    export default class HelloWorld extends Vue {
        @Watch('child')
        onChildChanged(val: string, oldVal: string) {}

        @Watch('person', { immediate: true, deep: true })
        onPersonChange1(val: Person, oldVal: Person) {};

        @Watch('person')
        onPersonChange2(val: Person, oldVal: Person) {};
    }

