<template>
    <div id='app'>
        <h1>App</h1>
        <p>user.id is {{id}}</p>
        <input type='text' v-model='id' />
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, ref } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        const user = reactive({
            id: 10,
            name: 'k',
        });

        return {
            ...toRefs(user),
        }
    },
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
</style>
