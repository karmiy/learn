<template>
    <div id='app'>
        <Header>
            <span class='title'>{{title}}</span>
        </Header>
        {{uid}}
        {{id}}
        {{code}}
        <input type='text' v-model='code' />
        <div v-is='"k"'>11</div>
        <component :is='"k"' />
        <!-- <button-counter></button-counter> -->
        <!-- <input type='text' v-model='title' /> -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '@/components/header.vue';
import UserInfo from '@/components/user-info.vue';

export default defineComponent({
    name: 'App',
    components: {
        Header,
        UserInfo,
    },
    props: {
        uid: Number,
    },
    setup({ uid }) {
        const rawUser = {
            id: 1,
            code: 100,
        };
        const user = reactive(rawUser);

        const router = useRouter();

        const route = useRoute();
        
        router.push;

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
