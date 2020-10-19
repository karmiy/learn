<template>
    <div id='app'>
        <Header>
            <span class='title'>{{title}}</span>
        </Header>
        <input type='text' v-model='id' />
        <input type='text' v-model='title' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs, getCurrentInstance } from 'vue';
import Header from '@/components/header.vue';
import UserInfo from '@/components/user-info.vue';

export default defineComponent({
    name: 'App',
    components: {
        Header,
        UserInfo,
    },
    setup() {
        const user = reactive({
            id: 1,
            code: 100,
            title: 't',
        });

        return {
            ...toRefs(user),
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
