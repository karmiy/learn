## TypeScript 代码检测

TypeScript 主要用于检查类型和语法错误

而代码检测工具主要用于检查和统一团队的代码风格，便于项目维护、降低沟通或阅读成本

相比于 TypeScript 更关注类型，代码检测工具更关注代码风格：

- 缩进 4 个空格还是 2 个空格

- 是否禁用 var

- 接口名是否以 I 开头

- 是否强制 === 不能 ==

### 检测工具选择

TypeScript 的代码检测工具的选择一直都在 TSLint 与 ESLint 之间

在之前很长的一段时间，TypeScript 都以 TSLint 为主，它对 TypeScript 的支持更友好

但由于一些性能问题，TypeScript 官方支持了 ESLint，随后 TSLint 作者宣布放弃 TSLint

随着 TSLint 被放弃，且 TSLint 作者加入 ESLint 为其提供 ESLint + TypeScript 的优化，现在 ESLint 显然是我们的首选

### ESLint 兼容性问题被解决

TSLint 直接寄生于 TypeScript 之下，它们 parser 相同，产生的 AST 也相同，BUG 更少，对 TypeScript 支持更友好

ESLint 的御用 parser 是基于 ESTree 标准，产生的 AST 与 TypeScript 并不相同

ESLint 需要额外的兼容工作来兼容 TypeScript，ESLint 做的一直不够好，但目前 TypeScript 官方支持了 ESLint，与 ESLint 共同发布了 [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) 来解决兼容问题

甚至 TypeScript 本身就作为测试平台，在兼容性方面 ESLint 的进步是实质性的，毕竟 typescript-eslint 这个 parser 的主要贡献者就是 TypeScript 团队本身

### ESLint 优势

在 TypeScript 官方团队帮助 ESLint 解决了兼容问题后，ESLint 优势更为明显：

- 可配置性更高：ESLint 的配置规则远多于 TSLint

- 更活跃的生态：基本上需要开发者能想到的插件，在 ESLint 都能找到，而基于这些插件我们也易于进行调整与拓展

### ESLint 的使用

全局安装：

    npm install -g eslint

    // 初始化配置文件
    eslint --init

局部安装：

    npm install eslint --save-dev

    // 初始化配置文件
    ./node_modules/.bin/eslint --init

初始化 ESLint：

    // 创建目录 demo-eslint，初始化项目
    npm init -y

    // 先安装 TypeScript 
    npm i -D typescript

    // 初始化 ESLint
    eslint --init

交互式问答环节：

- How would you like to use ESLint?  **To check syntax, find problems, and enforce code style**

- What type of modules does your project use? **JavaScript modules (import/export)**

- Which framework does your project use? **None of these**

- Does your project use TypeScript? **y**

- Where does your code run? **Browser, Node**

- How would you like to define a style for your project? **Use a popular style guide**

- Which style guide do you want to follow? **Airbnb**

- What format do you want your config file to be in? **JavaScript**

- Would you like to install them now with npm? **y**

ESLint 的初始化给了三个流行的方案：[Airbnb](https://github.com/airbnb/javascript) 、[Standard](https://github.com/standard/standard)、[Google](https://github.com/google/eslint-config-google)

严格程度：Airbnb > Google > Standard

这里选择 Airbnb，它相对更严格也更流行

### ESLint 配置项

初始化完毕后生成了 .eslintrc.js 文件：

    module.exports = {
        env: {
            browser: true,
            es6: true,
            node: true,
        },
        extends: [
            'airbnb-base',
        ],
        globals: {
            Atomics: 'readonly',
            SharedArrayBuffer: 'readonly',
        },
        parser: '@typescript-eslint/parser',
        parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
        },
        plugins: [
            '@typescript-eslint',
        ],
        rules: {
        },
    };

这个配置文件不仅仅可以是 .js，也可以是以下这些形式：

- .eslintrc.js(输出一个配置对象)

- .eslintrc.yaml

- .eslintrc.yml

- .eslintrc.json（ESLint的JSON文件允许JavaScript风格的注释）

- .eslintrc（可以是JSON也可以是YAML）

- package.json（在package.json里创建一个eslintConfig属性，在那里定义你的配置）

.eslintrc.js 优先级最高，依次往下排

#### env

指定环境，每个环境都有自己预定义的全局变量，可以同时指定多个环境：

     env: {
        browser: true,
        es6: true,
        node: true,
        commonjs: true,
        mocha: true,
        jquery: true,
    },

如我们在浏览器环境就需要设置 browser: true，node 环境则 node: true 等

#### extends

可以是一个字符串或字符串数组，数组中每个继承项继承它前面的配置

如我们继承了 Airbnb 的配置：

    extends: [
        'airbnb-base',
    ],

继承其他配置规则后依然可以对继承规则修改、覆盖与拓展：

- 启用额外的规则

- 改变继承的规则级别而不改变它的选项：

    - 基础配置："eqeqeq": ["error", "allow-null"]
    
    - 派生的配置："eqeqeq": "warn"

    - 最后生成的配置："eqeqeq": ["warn", "allow-null"]

- 覆盖基础配置中的规则的选项：

    - 基础配置："quotes": ["error", "single", "avoid-escape"]

    - 派生的配置："quotes": ["error", "single"]

    - 最后生成的配置："quotes": ["error", "single"]

#### globals

脚本执行期间访问的额外全局变量

通常情况下 ESLint 会对非源文件的全局变量进行警告，如访问浏览器环境下的 window 全局变量是可行的，但是我们自己创造的全局变量，ESLint 是会发出警告的

如我们创造了全局变量 Atomics、SharedArrayBuffer，就需要进行如下配置，告诉 ESLint 我们额外创造了这些全局变量，并配置是可写 writable 还是只读 readonly

     globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },

#### parser

ESLint 默认使用 Espree 作为其解析器，你可以在配置文件中指定一个不同的解析器

当我们在使用 TypeScript 时，就要用上 TypeScript 团队与 ESLint 联合发布的 typescript-eslint 解析器：

    parser: '@typescript-eslint/parser'

#### parserOptions

parser 解析代码时的配置参数

虽然我们定制了解析器，但是解析器要想适用当前环境也需要一定的配置

如指定 ECMAScript 版本，默认 5，这里可以制定 ES2018

指定资源类型为 module，即 ESMAScript 模块：

     parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    }

如果要使用额外的语言特性还可以添加 ecmafeatures 对象：

    parserOption: {
        ecmafeatures: {
            //允许在全局作用域下使用return语句
            globalReturn: false,
            //启用全局strict模式（严格模式）
            impliedStrict: false,
            //启用JSX
            jsx: false,
            //启用对实验性的objectRest/spreadProperties的支持
            experimentalObjectRestSpread: false
        }
    }

#### plugins

ESLint 支持使用第三方插件，可以 npm 安装它

在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 eslint-plugin- 前缀

plugins 与 extends 区别：

- extends 提供的是 eslint 现有规则的一系列预设

- plugin 则提供了除预设之外的自定义规则

#### rules

ESLint 具体规则的配置，我们通常情况下是使用社区比较刘的配置集，但是这些流行的配置集不一定适合当前的团队，或者当前的项目

有一些配置集比较松散比如：Standard，有一些配置集非常严苛比如：Airbnb，这个时候我们就需要进行二次拓展或者关闭一些不必要的选项，就需要用 rules 选项进行覆盖或者修改

更多的 rules 参考 [官方rules](https://eslint.bootcss.com/docs/rules/)
