## createApp

vue2.x 中的全局 API 在 vue3 也发生了改变

vue2.x：

```ts
import Vue from 'vue';
import App from './App.vue';

Vue.config.ignoredElements = [/^app-/];
Vue.use(/* ... */);
Vue.mixin(/* ... */);
Vue.component(/* ... */);
Vue.directive(/* ... */);

Vue.prototype.customProperty = 100;

new Vue({
    render: h => h(App)
}).$mount('#app');
```

vue3：

```ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.isCustomElement = tag => tag.startsWith('app-');
app.use(/* ... */);
app.mixin(/* ... */);
app.component(/* ... */);
app.directive(/* ... */);

app.config.globalProperties.customProperty = 100;

app.mount(App, '#app');
```

app 上的方法：

- config

- use 

- mixin

- component

- directive

- mount

- unmount

- provide/inject

更多调整可以查看 [https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md)