import { createApp, App as AppType } from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';
import Button from './components/button.vue';

const app = createApp(App, {
    uid: 108,
});

app.config.globalProperties.baseUrl = '/client';

app.directive('style', {
    beforeMount(el, binding) {
        const { arg, value } = binding;
        arg && (el.style[arg] = value);
    }
});

app.config.optionMergeStrategies.hello = (parent, child, vm) => {
    console.log(1);
    return `Hello, ${child}`
};

app.mixin({
    hello: 'Vue',
})

app.provide('theme', 'dark');

app.component(Button.name, Button);

const log = {
    install(app: AppType) {
        // console.log(app, 'log');
    }
}

app.use(store)
    .use(router)
    .use(log)
    .mount('#app');
    