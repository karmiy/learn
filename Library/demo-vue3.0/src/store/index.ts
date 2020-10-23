import { createStore } from 'vuex';

export default createStore({
    state: {
        isLogin: true,
    },
    mutations: {
        updateLogin(state, login: boolean) {
            state.isLogin = login;
        }
    },
    actions: {},
    modules: {}
});
