## TypeScript 与 React

单独使用 TypeScript 时一般没有太大的问题，但是一旦配合框架使用，往往会遇到很多的坑，如使用 React、Vue 这些框架时与 TypeScript 结合就经常会出现障碍

这里会对 TypeScript 与 React 的结合使用进行一些简单的示例

### TypeScript 版 React

可以使用官方的 create-react-app 来构建项目，也可以自己搭 webpack 环境

- 官方脚手架

    create-react-app react-ts-app --scripts-version=react-scripts-ts

- 本地搭建 webpack 环境

除了 jsx 需要的脚手架配置外，要使用 TypeScript 还需要额外的内容

安装依赖包：

    npm install -D @types/react @types/react-dom ts-loader typescript

webpack 的 rules 配置：

    {
        test:/\.tsx?$/,
        exclude: /node_modules/,
        loader:"ts-loader"
    },

根目录 tsconfig.json：

    {
        // 编译选项
        "compilerOptions": {
            "target": "es5",                            // 指定 ECMAScript 目标版本: 'ES5'
            "module": "commonjs",                       // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
            "moduleResolution": "node",                 // 选择模块解析策略
            "experimentalDecorators": true,             // 启用实验性的ES装饰器
            "allowSyntheticDefaultImports": true,       // 允许从没有设置默认导出的模块中默认导入。
            "sourceMap": true,                          // 把 ts 文件编译成 js 文件的时候，同时生成对应的 map 文件
            "strict": true,                             // 启用所有严格类型检查选项
            "noImplicitAny": true,                      // 在表达式和声明上有隐含的 any类型时报错
            "alwaysStrict": true,                       // 以严格模式检查模块，并在每个文件里加入 'use strict'
            "declaration": true,                        // 生成相应的.d.ts文件
            "removeComments": true,                     // 删除编译后的所有的注释
            "noImplicitReturns": true,                  // 不是函数的所有返回路径都有返回值时报错
            "noImplicitThis": true,
            "importHelpers": true,                      // 从 tslib 导入辅助工具函数
            "lib": ["es6", "dom", "ESNext"],                      // 指定要包含在编译中的库文件
            "typeRoots": ["node_modules/@types"],
            "outDir": "./dist",
            "jsx": "react", // jsx的版本,使用这个就不需要额外使用babel了，会编译成React.createElement
        },
        // 为了加快整个编译过程，我们指定相应的路径
        "include": [
            "./src/**/*"
        ]
    }
    
### 无状态组件

无状态组件是非常常见的 React 组件，主要用于展示 UI

假设要封装一个 Logo 组件，在 jsx 中一般是这样封装的：

    // logo.tsx
    import * as React from 'react';

    function Logo(props) {
        const { className, src, alt } = props;
        return <img className={className} src={src} alt={alt} />
    }

    export default Logo;

然而仅仅这样，在 tsx 中是会报错的：

![Alt text](imgs/24-01.png)

因为我们没有定义 props 的类型，接着使用 interface 定义 props 的类型：

    import * as React from 'react';

    interface ILogoProps {
        src: string;
        className?: string;
        alt?: string;
    }

    function Logo(props: ILogoProps) {
        const { className, src, alt } = props;
        return <img className={className} src={src} alt={alt} />
    }

    export default Logo;

可以看到，报错消失了，似乎没有问题

但是让我们要用到 children 时，是不是又需要定义 children 类型：

    interface ILogoProps {
        src: string;
        className?: string;
        alt?: string;
        children?: React.ReactNode;
    }

其实 React 的提供了更规范的用法, **type SFC\<P>**，这个工具类型里已经定义了 children 类型：

    import * as React from 'react';

    interface ILogoProps {
        src: string;
        className?: string;
        alt?: string;
    }

    const Logo: React.FC<ILogoProps> = (props) => {
        const { className, src, alt } = props;
        return <img className={className} src={src} alt={alt} />
    }

    export default Logo;

还可以在 interface 上加注释：

    interface ILogoProps {
        /**
        * logo 地址
        */
        src: string;
        className?: string;
        alt?: string;
    }

在使用时不仅 props 会有提示，还会显示注释信息：

![Alt text](imgs/24-02.png)

### 有状态组件

假设需要编写一个有状态组件 Todo，在 jsx 的写法为：

    import * as React from 'react';

    export default class Todo extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                itemText: '',
            }
        }
    }

这同样会报错：

![Alt text](imgs/24-03.png)

有状态组件除了 props 之外还需要 state，对于 class 组件，React 的 Component 提供了泛型支持，即 **Component<P, S>**

并且 React 的声明文件已经自动帮我们加上了 **readonly** 标记，不需要我们手动为 props 与 state 加只读标记：

    import * as React from 'react';

    interface ITodoProps {
        handleSubmit: (value: string) => void
    }

    interface ITodoState {
        itemText: string
    }

    export default class Todo extends React.Component<ITodoProps, ITodoState> {
        constructor(props: ITodoProps) {
            super(props);
            this.state = {
                itemText: '',
            }
        }
    }

接着还可以为组件添加方法

因为大多情况下，该方法是组件的私有方法，这时需要使用 **private** 访问控制符：

    export default class TodoInput extends React.Component<ITodoInputProps, ITodoInputState> {
        constructor(props: ITodoInputProps) {
            super(props);
            this.state = {
                itemText: '',
            }
        }

        private updateValue = (value: string) => {
            this.setState({ itemText: value })
        }

        render() {
            return (
                <div>
                    {this.state.itemText}
                </div>
            )
        }
    }

### 非受控组件

一般我们在编写非受控组件时，需要用到 ref

如在 Input 组件更新完毕后，要让 input 输入框 focus 聚焦：

    import * as React from 'react';

    interface IInputProps {
        autoFocus?: boolean;
    }
    interface IInputState {
        currentValue: string;
    }

    export default class Input extends React.Component<IInputProps, IInputState> {
        private inputRef = React.createRef<HTMLInputElement>();
        state = {
            currentValue: '',
        }

        componentDidUpdate() {
            const inputEl = this.inputRef.current as HTMLInputElement;
            inputEl.focus();
            this.setState({
                currentValue: inputEl.value,
            })
        }

        render() {
            return (
                <div>
                    {this.state.currentValue}
                    <input type="text" ref={this.inputRef} />
                </div>
            )
        }
    }

需要注意的是 createRef 需要一个泛型

因为是 input，类型是 HTMLInputElement，如果是div，则为 HTMLDivElement

### 受控组件

将上例的 Input 组件改为受控组件：

    import * as React from 'react';

    interface IInputProps {
        autoFocus?: boolean;
    }
    interface IInputState {
        value: string;
    }

    export default class Input extends React.Component<IInputProps, IInputState> {
        state = {
            value: '',
        }

        private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                value: e.target.value,
            })
        }

        render() {
            return (
                <div>
                    <input type="text" value={this.state.value} onChange={this.onChange} />
                </div>
            )
        }
    }

### 事件处理

可以看到，对于事件 e 的类型定义，需要用到 **React.ChangeEvent\<T>**，同样，对于表单事件需要用到 **React.FormEvent\<T>**：

    export default class Input extends React.Component<IInputProps, IInputState> {
        state = {
            value: '',
        }

        private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                value: e.target.value,
            })
        }
        private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        }

        render() {
            return (
                <div>
                    <form onSubmit={this.onSubmit}>
                        <input type="text" value={this.state.value} onChange={this.onChange} />
                    </form>
                </div>
            )
        }
    }

> React 在合成事件上有这么多的定义，在遇到各种事件时应该如何搜索正确的类型？技巧：在组件上输入事件对应的名称通过提示了解事件类型

![Alt text](imgs/24-04.png)

下面列出一些常用 Event 对象类型：

- ClipboardEvent<T = Element> 剪贴板事件对象

- DragEvent<T = Element> 拖拽事件对象

- ChangeEvent<T = Element>  Change 事件对象

- KeyboardEvent<T = Element> 键盘事件对象

- MouseEvent<T = Element> 鼠标事件对象

- TouchEvent<T = Element>  触摸事件对象

- WheelEvent<T = Element> 滚轮事件对象

- AnimationEvent<T = Element> 动画事件对象

- TransitionEvent<T = Element> 过渡事件对象

当我们定义事件处理函数时有没有更方便定义其函数类型的方式呢？

React 声明文件所提供了 EventHandler 类型别名，通过不同事件的 EventHandler 的类型别名来定义事件处理函数的类型：

    
    type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];
    type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
    type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

即 onChange 事件可以从:

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: e.target.value,
        })
    }

改为：

    private onChange:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({
            value: e.target.value,
        })
    }


### 默认属性

React 中有时会运用很多默认属性，我们可以直接为 defaultProps 赋值，还有一种方法是利用 class 同时声明类型和初始值

    import * as React from 'react';

    interface InputSetting {
        placeholder: string
        maxlength: number
    }

    class IInputProps {
        public autoFocus?: boolean = false;
        public inputSetting?: InputSetting = {
            placeholder: '请输入',
            maxlength: 10,
        }
    }

    interface IInputState {
        value: string;
    }

    export default class Input extends React.Component<IInputProps, IInputState> {
        public static defaultProps = new IInputProps();
        state = {
            value: '',
        }

        private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                value: e.target.value,
            })
        }

        render() {
            const { autoFocus, inputSetting } = this.props;
            return (
                <div>
                    <input 
                        type="text" 
                        value={this.state.value} 
                        onChange={this.onChange}
                        maxLength={inputSetting!.maxlength}
                        placeholder={inputSetting!.placeholder}
                    />
                </div>
            )
        }
    }

可以看到，我们将 class 直接作为类型传入了 React.Component 的泛型第一个参数中，又在 defaultProps 中直接 new 这个 class 来作为初始值

利用 class 作为 props 类型及默认属性实例的好处：

- 代码量少：一次编写，既可以作为类型也可以实例化作为值使用

- 避免错误：分开编写一旦有一方造成书写错误不易察觉

但是在使用过程中会有一个问题，虽然我们已经设置了默认属性，使用时依旧显示 inputSetting 可能未定义

解决方式：

- 如代码所示利用 ! 告诉编译器这里不是 undefined

- 利用三目运算 inputSetting ? inputSetting.maxlength | undefined

- 利用高级类型将 props 可选默认属性改为必选

第三种方案，我们可以创建一个函数，帮助我们将 props 中拥有默认值的可选属性，转为必选类型：

    const createPropsGetter = <DP extends object>(defaultProps: DP) => {
        return <P extends Partial<DP>>(props: P) => {
            type PropsExcludingDefaults = Omit<P, keyof DP>;
            type RecomposedProps = DP & PropsExcludingDefaults;

            return (props as any) as RecomposedProps
        }
    }

完整使用：

    import * as React from 'react';

    interface InputSetting {
        placeholder: string
        maxlength: number
    }

    const defaultProps = {
        autoFocus: false,
        inputSetting: {
            placeholder: '请输入',
            maxlength: 10,
        }
    }

    class IInputProps {
        public autoFocus?: boolean;
        public inputSetting?: InputSetting;
    }

    interface IInputState {
        value: string;
    }

    const createPropsGetter = <DP extends object>(defaultProps: DP) => {
        return <P extends Partial<DP>>(props: P) => {
            type PropsExcludingDefaults = Omit<P, keyof DP>;
            type RecomposedProps = DP & PropsExcludingDefaults;

            return (props as any) as RecomposedProps
        }
    }

    const getProps = createPropsGetter(defaultProps);

    export default class Input extends React.Component<IInputProps, IInputState> {
        public static defaultProps = new IInputProps();
        state = {
            value: '',
        }

        private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                value: e.target.value,
            })
        }

        render() {
            const { autoFocus, inputSetting } = getProps(this.props);
            return (
                <div>
                    <input 
                        type="text" 
                        value={this.state.value} 
                        onChange={this.onChange}
                        maxLength={inputSetting.maxlength}
                        placeholder={inputSetting.placeholder}
                    />
                </div>
            )
        }
    }

### Render Props

实现组件复用的其中一种方式是将组件的 children 作为函数，或利用 render 属性，让复用组件的内部去调用这个函数，即 render props 的用法

下面实现一个 render props 的 Togglable 组件：

    import * as React from 'react';

    const isFunc = (f: any): f is Function => Object.prototype.toString.call(f) === '[object Function]';

    const initialState = {
        show: false,
    }

    type State = typeof initialState;

    type Props = Partial<{
        children: RenderCb;
        render: RenderCb;
    }>

    interface ToggleParams {
        show: State['show'];
        toggle: Togglable['toggle'];
    }

    type RenderCb = (args: ToggleParams) => JSX.Element;

    const updateShowState = (prevState: State) => ({ show: !prevState.show });

    export default class Togglable extends React.Component<Props, State> {
        state: State = initialState;
        
        render() {
            const { render, children } = this.props;
            const renderProps = {
                show: this.state.show,
                toggle: this.toggle,
            };

            if(render) {
                return render(renderProps);
            }

            return isFunc(children) ? children(renderProps) : null;
        }

        private toggle = (event: React.MouseEvent<HTMLElement>) => this.setState(updateShowState);
    }

上例中 type RenderCb = (args: ToggleParams) => JSX.Element 返回了 JSX.Element

JSX.Element 与 React.ReactNode 的差别在于：React.ReactNode 可以是 React 元素，字符串，布尔值等等，而 JSX.Element 只能是 React 元素如 \<div>...\</div>，也可以是 React.Fragment

使用时，提示功能非常友好：

![Alt text](imgs/24-05.png)

### 组件注入与泛型组件

在使用 react-router 时有着组件注入的模式：

    <Route path="/foo" component={MyView} />


组件注入即将组件传入：

    type Props = Partial<{
        children: RenderCb;
        render: RenderCb;
        component: React.ComponentType<ToggleParams>;
    }>;

    // 用法
    const { component: InjectComp } = this.props;
    const renderProps = {
        show: this.state.show,
        toggle: this.toggle,
    };
    return <InjectComp {...renderProps} />;

除此之外，我们可能还会传递一个 props 用于 component 中：

    const { component: InjectComp, props } = this.props;
    const renderProps = {
        show: this.state.show,
        toggle: this.toggle,
    };
    return <InjectComp {...renderProps} {...props} />;

这时我们可能需要改写 type Props 为：

    type Props<T extends object = {}> = Partial<{
        children: RenderCb;
        render: RenderCb;
        component: React.ComponentType<ToggleParams & T>;
        props: T
    }>;

我们期望 props 与组件 component 是对应的，即如果 component 这个组件是 ToggleParams & { name?: string }，那传入的 props 也应该只能是 { name?: string }，而不能传别的属性

这就需要用到**泛型组件**

    export default class Togglable<T extends object = {}> extends React.Component<Props<T>, State> {
        ...
    }

但是我们可以在 JSX 上使用泛型类型吗？不幸的是，并不行

但我们可以在泛型组件上引入一个静态方法，用于注入组件的类型：

    type Constructor<T = {}> = new (...args: any[]) => T;

    export default class Togglable<T extends object = {}> extends React.Component<Props<T>, State> {
        static ofType<T extends object>() {
            return Togglable as Constructor<Togglable<T>>;
        }
    }

使用方式：

    type ITitleProps = {
        name?: string;
    } & ToggleParams;

    const Title: React.SFC<ITitleProps> = (props) => {
        return (
            <div>
                {props.name}
            </div>
        )
    }

    const TogglableWithTitle = Togglable.ofType<Omit<ITitleProps, keyof ToggleParams>>();

    function App() {
        return (
            <div>
                <TogglableWithTitle 
                    component={Title}
                    props={{name: 'k'}}
                />
            </div>
        )
    }

完整代码：

    import * as React from 'react';

    const isFunc = (f: any): f is Function => Object.prototype.toString.call(f) === '[object Function]';

    const initialState = {
        show: false,
    }

    type State = typeof initialState;

    type Props<T extends object = {}> = Partial<{
        children: RenderCb;
        render: RenderCb;
        component: React.ComponentType<(ToggleParams & Partial<T>) | ToggleParams>;
        props: Partial<T>;
    }>;


    export type ToggleParams = {
        show: State['show'];
        toggle: Togglable['toggle'];
    };

    type RenderCb = (args: ToggleParams) => JSX.Element;

    type Constructor<T = {}> = new (...args: any[]) => T;

    const updateShowState = (prevState: State) => ({ show: !prevState.show });

    export default class Togglable<T extends object = {}> extends React.Component<Props<T>, State> {
        state: State = initialState;
        static ofType<T extends object>() {
            return Togglable as Constructor<Togglable<T>>;
        }
        render() {
            const { render, children, component: InjectComp, props } = this.props;
            const renderProps = {
                show: this.state.show,
                toggle: this.toggle,
            };

            if(InjectComp) {
                return props ?
                    <InjectComp {...renderProps} {...props} />
                    :
                    <InjectComp {...renderProps} />;
            }

            if(render) {
                return render(renderProps);
            }

            return isFunc(children) ? children(renderProps) : null;
        }

        private toggle = (event: React.MouseEvent<HTMLElement>) => this.setState(updateShowState);
    }

![Alt text](imgs/24-06.png)

可以看到，注入组件后，传 props 时也会后非常友好的提示

### 高阶组件

假设有一些组件，有通用的 setting 这个 props，可以封装一个高阶组件来为组件传递通用属性：

    import * as hoistNonReactStatics from 'hoist-non-react-statics'
    import * as React from 'react'

    const hocProps = {
        setting: {
            maxLength: 30,
            placeholder: '请输入',
        }
    }

    type InjectProps = Partial<typeof hocProps>;

    const withTodoInput = <P extends InjectProps>(UnwrappedComponent: React.ComponentType<P>) => {
        type Props = Omit<P, keyof InjectProps>;

        class WithToggleable extends React.Component<Props> {
            public static readonly UnwrappedComponent = UnwrappedComponent;

            public render() {
                return (
                    <UnwrappedComponent 
                        setting={hocProps}
                        {...this.props as P}
                    />
                )
            }
        }

        return hoistNonReactStatics(WithToggleable, UnwrappedComponent)
    }

### Redux

在项目中仅仅组件之间传递属性是不够的，经常还会涉及到对状态的管理，React 中一般用 redux 来作为状态管理工具

这里简单的创建 redux 需要使用的 model、action、reducer

#### Model

在 model 中定义数据模型接口：

    // models/Todo.ts
    export interface Todo {
        id: number;
        name: string;
        done: boolean;
    }

#### Action

定义两个函数 addTodo 与 toggleTodo，用于添加项与切换状态

使用 ReturnType 获取 action 的类型：

    // actions/todo.ts
    export enum ActionTodoConstants {
        ADD_TODO = 'todo/add',
        TOGGLE_TODO = 'todo/toggle',
    }

    let id = 0;

    const addTodo = (name: string) => ({
        payload: {
            todo: {
                done: false,
                id: id++,
                name,
            }
        },
        type: ActionTodoConstants.ADD_TODO,
    });

    const toggleTodo = (id: number) => ({
        payload: {
            id,
        },
        type: ActionTodoConstants.TOGGLE_TODO,
    });

    export type AddTodoAction = ReturnType<typeof addTodo>;
    export type ToggleTodoAction = ReturnType<typeof toggleTodo>;
    export type Action = AddTodoAction | ToggleTodoAction;

#### Reducer

创建 reducer 执行工厂：

    // reducers/todo.ts
    import { Todo } from '../models/todo';
    import { ActionTodoConstants, Action } from '../actions/todo';

    // 定义State的接口
    export interface State {
        todos: Todo[];
    }

    export const initialState: State = {
        todos: [],
    }

    export function reducer(state: State = initialState, action: Action) {
        switch (action.type) {

        case ActionTodoConstants.ADD_TODO: {

            const todo = action.payload;
            return {
            ...state,
            todos: [...state.todos, todo],
            };
        }

        case ActionTodoConstants.TOGGLE_TODO: {

            const { id } = action.payload;
            return {
            ...state,
            todos: state.todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo),
            }
        }

        default:
            return state;
        }
    }

然而在 const { id } = action.payload; 处却报错

查看 action 的类型，ReturnType 将其类型推导成了：

    type Action = {
        payload: {
            todo: {
                done: boolean;
                id: number;
                name: string;
            };
        };
        type: ActionTodoConstants;
    } | {
        payload: {
            id: number;
        };
        type: ActionTodoConstants;
    }

可以看到这是类型推导的错误，type: ActionTodoConstants 而不是 type: ActionTodoConstants.ADD_TODO 与 type:  ActionTodoConstants.TOGGLE_TODO

将 action 部分进行修改为字符串字面量类型即可：

    export type AddTodoAction = {
        type: ActionTodoConstants.ADD_TODO;
        payload: { 
            todo: Todo;
        }
    };
    export type ToggleTodoAction = {
        type:  ActionTodoConstants.TOGGLE_TODO;
        payload: {
            id: number;
        }
    };
    export type Action = AddTodoAction | ToggleTodoAction;

