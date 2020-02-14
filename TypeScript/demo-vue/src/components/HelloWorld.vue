<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <p>{{ count }}</p>
        <p>{{ total }}</p>
        <p>PropC: {{ propC }}</p>
        <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)">
        <van-button type="default" @click="add">+</van-button>
        <p>Vuex：</p>
        <p>todoList: {{todos}}</p>
        <p>todoCount: {{todoCount}}</p>
        <van-button type="primary" @click="createTodoHandler">add todo</van-button>
        <p>Foods: {{foods}}</p>
        <p>FoodCount: {{foodCount}}</p>
        <van-button type="primary" @click="addFoodHandler">add food</van-button>
        <p>
            For a guide and recipes on how to configure / customize this project,
            <br />check out the
            <a
                href="https://cli.vuejs.org"
                target="_blank"
                rel="noopener"
            >vue-cli documentation</a>.
        </p>
        <h3>Installed CLI Plugins</h3>
        <ul>
            <li>
                <a
                    href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
                    target="_blank"
                    rel="noopener"
                >babel</a>
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
                    target="_blank"
                    rel="noopener"
                >typescript</a>
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa"
                    target="_blank"
                    rel="noopener"
                >pwa</a>
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
                    target="_blank"
                    rel="noopener"
                >eslint</a>
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest"
                    target="_blank"
                    rel="noopener"
                >unit-jest</a>
            </li>
        </ul>
        <h3>Essential Links</h3>
        <ul>
            <li>
                <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
            </li>
            <li>
                <a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a>
            </li>
            <li>
                <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a>
            </li>
            <li>
                <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a>
            </li>
            <li>
                <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
            </li>
        </ul>
        <h3>Ecosystem</h3>
        <ul>
            <li>
                <a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a>
            </li>
            <li>
                <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/vue-devtools#vue-devtools"
                    target="_blank"
                    rel="noopener"
                >vue-devtools</a>
            </li>
            <li>
                <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a>
            </li>
            <li>
                <a
                    href="https://github.com/vuejs/awesome-vue"
                    target="_blank"
                    rel="noopener"
                >awesome-vue</a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit, Model } from "vue-property-decorator";
import { State, Mutation, Getter, Action } from 'vuex-class';
import { ITodo } from '../store/state';
import { IFood } from '../store/modules/cart';

interface Person {
    id: number;
    name: string;
    children?: Person[];
}

@Component
export default class HelloWorld extends Vue {
    count: number = 123; // data
    add(): void {
        // methods
        this.count += 1;
    }

    get total() {
        // computed
        return this.count + 10;
    }

    set total(v: number) {
        // computed
        this.count = v;
    }

    // Prop
    @Prop() private msg!: string;
    @Prop(String)
    propA!: string;

    @Prop([String, Number])
    propB!: string | number;

    @Prop({
        type: Array,
        default: () => ["a", "b"],
        required: true,
        validator: value => value.indexOf('a') !== -1
    })
    propC!: Array<string>;

    // Watch
    @Watch("child")
    onChildChanged(val: string, oldVal: string) {}

    @Watch("person", { immediate: true, deep: true })
    onPersonChange1(val: Person, oldVal: Person) {}

    @Watch("person")
    onPersonChange2(val: Person, oldVal: Person) {}

    // Emit
    mounted() {
        this.$on('emit-todo', function(n: string) {
            console.log(n);
        });
        this.f('v');
    }
    @Emit('emit-todo')
    f(n: string) {
    }

    // Model
    @Model('change', { type: Boolean })
    checked!: boolean;

    // Vuex
    @State(state => state.todoList) private todos!: ITodo[];
    @Mutation('createTodo') private create!: (todo: ITodo) => void;
    @Action('doubleCreate') private doubleCreate!: (todo: ITodo) => void;

    private createTodoHandler() {
        /* this.create({
            id: Date.now(),
            name: 'new task',
            isDone: false,
        }); */
        
        this.doubleCreate({
            id: Date.now(),
            name: 'new task',
            isDone: false,
        });
    }

    @Getter private todoCount!: number;

    @State(state => state.cart.foodList) private foods!: IFood[];
    // @Mutation('addFood') private addF!: (food: IFood) => void;
    @Mutation('cart/addFood') private addF!: (food: IFood) => void; // namespaced
    @Action('doubleAdd') private doubleA!: (food: IFood) => void;
    // @Action('cart/doubleAdd') private doubleA!: (food: IFood) => void; // namespaced
    // @Getter('foodCount') private foodCount!: number;
    @Getter('cart/foodCount') private foodCount!: number; // namespaced
    private addFoodHandler() {
        /* this.addF({
            id: Date.now(),
            name: 'banana',
            price: 10,
        }) */
        this.doubleA({
            id: Date.now(),
            name: 'banana',
            price: 10,
        })
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
