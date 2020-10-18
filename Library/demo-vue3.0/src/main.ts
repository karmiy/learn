import { createApp } from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.directive('style', {
    beforeMount(el, binding) {
        const { arg, value } = binding;
        arg && (el.style[arg] = value);
    }
});

app.use(store)
    .use(router)
    .mount('#app');
