<template>
    <div id='app'>
        <!-- <Header>
            <span class='title'>Title</span>
        </Header> -->
        <!-- {{isLogin ? 'login' : 'unlogin'}}
        <button @click='toggleLogin'>toggle login</button> -->
        {{id}}
        {{code}}
        <input type='text' v-model='code' />
        <div v-for='(item, i) in list' :key='item' :ref='el => divs[i] = el'>
            {{ item }}
        </div>
        <!-- <button-counter></button-counter> -->
        <!-- <input type='text' v-model='title' /> -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, ref } from 'vue';
import Header from '@/components/header.vue';
import UserInfo from '@/components/user-info.vue';

export default defineComponent({
    name: 'App',
    components: {
        Header,
        UserInfo,
    },
    setup() {
        const rawUser = {
            id: 1,
            code: 100,
        };
        const user = reactive(rawUser);

        const list = reactive([1, 2, 3])
        const divs = ref([]);

        return {
            ...toRefs(user),
            list,
            divs,
        }
    }
});
</script>

<style lang='scss' scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
::v-global(.test) {
    color: red;
}

#app ::v-global(.header h1) {
    // color: pink;
}

/* .title {
    color: pink;
} */
</style>
