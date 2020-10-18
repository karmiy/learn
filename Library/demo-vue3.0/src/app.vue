<template>
    <div ref='appRef' id='app'>
        <Header title='Title' />
        {{code}}
        <UserInfo :code='code' @codeChange='code = $event' />
        <button @click='open = !open'>Toggle Modal</button>
        <ul>
            <li>
                <router-link to='/home' custom v-slot='{ href, navigate, isActive }'>
                    <a :class='{ isActive }' :href='href' @click='navigate'>to home</a>
                </router-link>
            </li>
            <li><router-link to='/about'>to about</router-link></li>
        </ul>
        <router-view />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, onMounted, ref, isRef } from 'vue';
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
            name: 'k',
            age: 13,
            code: 100,
        });

        const lockRef = ref('open');
        const appRef = ref<HTMLDivElement>();

        onMounted(() => {
            console.log(appRef.value);
        });

        return {
            ...toRefs(user),
            appRef,
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
    color: pink;
}
</style>
